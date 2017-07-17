<?php

require __DIR__ . '/vendor/autoload.php';

$client = new \GuzzleHttp\Client();

$apiUrl = 'http://integration.marketscan.io/scan/rest/mscanservice.rst';
$partnerID = '07957435-A7CC-4695-8922-109731B322C7';
$accountNumber = '890000';
$vin = '1FMCU0GD8HUC76968';
$zip = '75703';

// Get Customer Types
$customerTypesResponse = $client->get(
    "$apiUrl/?GetManufacturers/$partnerID/$accountNumber"
);

// Special case is CustomerType ID 38, "Individual" is make "ANY"
$MarketScanManufacturerNameToJatoMakeNameMap = [
    'General Motors' => 'GMC',
    'Chrysler' => 'Chrysler',
    'BMW' => 'BMW',
    'Hyundai' => 'Hyundai',
    'KIA' => 'Kia',
    'Mazda' => 'Mazda',
    'Toyota' => 'Toyota',
    'Lexus' => 'Lexus',
    'Volvo' => 'Volvo',
    'Mini' => 'MINI',
    'Ford' => 'Ford',
    'Lincoln' => 'Lincoln',
    'Honda' => 'Honda',
    'Acura' => 'Acura',
    'Nissan' => 'Nissan',
    'Infiniti' => 'Infiniti',
    'Volkswagen' => 'Volkswagen',
    'Audi' => 'Audi',
    'Mercedes Benz' => 'Mercedes-Benz',
    'Smart' => 'smart',
    'Subaru' => 'Subaru',
    'Jaguar' => 'Jaguar',
    'Land Rover' => 'Land Rover',
    'Porsche' => 'Porsche',
    'Mitsubishi' => 'Mitsubishi',
    'Bentley' => 'Bentley',
    'Maserati' => 'Maserati',
    'Genesis' => 'Genesis',
];

$customerTypeIDToCustomerTypeNameMap = array_reduce(
    json_decode((string) $customerTypesResponse->getBody(), true),
    function ($carry, $manufacturer) use ($MarketScanManufacturerNameToJatoMakeNameMap) {
        $jatoMakeName = $MarketScanManufacturerNameToJatoMakeNameMap[$manufacturer['Name']]
            ?? ($manufacturer['Name'] === 'ANY' ? 'ANY' : false);

        if ($jatoMakeName === 'ANY') {
            return $carry;
        }

        if (! $jatoMakeName) {
            throw new \Exception('Missing mapping');
        }

        foreach ($manufacturer['CustomerTypes'] as $customerType) {
            $carry[$customerType['ID']] = $customerType['Name'];
        }

        return $carry;
    },
    [
        // Special case is CustomerType ID 38, "Individual" is make "ANY"
        38 => 'Individual',
    ]
);


// get VehicleID by vin
$vinResponse = $client->get(
    "$apiUrl/?GetVehiclesByVIN/$partnerID/$accountNumber/$vin/True"
);

$vehicleID = json_decode((string) $vinResponse->getBody(), true)[0]['ID'];

$response = $client->post(
    "$apiUrl/?GetRebatesParams/$partnerID/$accountNumber",
    [
        'json' => [
            // 2017-07-07T17:09:37.366Z
            'DateTimeStamp' =>  \Carbon\Carbon::now()->toW3cString(),
            'IncludeExpired' => false,
            'VehicleID' => $vehicleID,
            'ZIP' => $zip,
        ]
    ]
);

$possibleRebates = collect(json_decode((string) $response->getBody(), true)['Rebates'])
    ->map(function ($rebate) use ($customerTypeIDToCustomerTypeNameMap) {
        // add name to customer types
        $customerTypesWithNames = array_map(function ($customerType) use ($customerTypeIDToCustomerTypeNameMap) {
            return [
                'customerTypeName' => $customerTypeIDToCustomerTypeNameMap[$customerType['ID']],
                'id' => $customerType['ID'],
                'autoSelect' => $customerType['AutoSelect'],
            ];
        }, $rebate['CustomerTypes'] ?? []);

        $rebate['CustomerTypes'] = $customerTypesWithNames;

        return $rebate;
    })->filter(function ($rebate) {
        // filter out non-value (dollars?) rebates
        $hasValue = $rebate['Value']['Values'][0]['Value'] > 0;

        // filter out non-individual customer types
        $forIndividual = array_first($rebate['CustomerTypes'], function ($customerType) {
                return $customerType['customerTypeName'] === 'Individual';
            }) > 0;

        return $hasValue && $forIndividual;
    })->map(function ($rebate) {
        return [
            'id' => $rebate['ID'],
            'rebate' => $rebate['NameDisplay'],
            'value' => $rebate['Value']['Values'][0]['Value'],
        ];
    });

$compatibilityResponse = $client->post(
    "$apiUrl/?GetRebatesCompatibilityParams/$partnerID/$accountNumber",
    [
        'json' => [
            'P' => [
                // 2017-07-07T17:09:37.366Z
                'DateTimeStamp' =>  \Carbon\Carbon::now()->toW3cString(),
                'IncludeExpired' => false,
                'VehicleID' => $vehicleID,
                'ZIP' => $zip,
            ],
            'RebateValues' => $possibleRebates->values()->map(function ($rebate) {
                return [
                    'RebateID' => $rebate['id'],
                ];
            }),
        ]
    ]
);

$compatibilities = array_map(function ($compatibilityList) {
    return $compatibilityList['CompatibilityList'];
}, json_decode((string) $compatibilityResponse->getBody(), true)['Compatibilities']);

// we pick a rebate 1 at a time, after every selection we need to update the "compatible rebates list"
$compatibleRebatesList = array_values($possibleRebates->toArray());

$selectedRebates = [];

$selectRebate = function ($rebate, $selectedRebates, $compatibilities, $compatibleRebatesList) {
    // if it is already in $selectedRebates do nothing
    if (in_array($rebate, $selectedRebates)) {
        return [$selectedRebates, $compatibleRebatesList];
    }

    $withThisRebate = array_map(function ($rebate) {
        return $rebate['id'];
    }, array_merge($selectedRebates, [$rebate]));

    $nextCompatibilities = [];
    foreach ($compatibilities as $compatibleRebateIds) {
        if (!array_diff($withThisRebate, $compatibleRebateIds)) {
            // return new selected rebates and new compatibilityList
            $nextCompatibilities = array_unique(array_merge($nextCompatibilities, $compatibleRebateIds));
        }
    }

    if (!empty($nextCompatibilities)) {
        return [array_merge($selectedRebates, [$rebate]), array_map(function ($compID) use ($compatibleRebatesList) {
            return array_first($compatibleRebatesList, function ($compatibleRebate) use ($compID) {
                return $compID === $compatibleRebate['id'];
            });
        }, $nextCompatibilities)];
    }

    // do nothing
    return [$selectedRebates, $compatibleRebatesList];
};
// API endpoint: getCompatibleRebatesList : Zipcode -> VIN -> SelectedRebates[] -> CompatibleRebates[]
// Response: { compatibleRebates }
// from request we get a list of rebates the user has selected, and return the updated $compatibleRebatesList

[$selectedRebates, $compatibleRebatesList] = $selectRebate(
    $compatibleRebatesList[0], $selectedRebates, $compatibilities, $compatibleRebatesList
);

[$selectedRebates, $compatibleRebatesList] = $selectRebate(
    $compatibleRebatesList[0], $selectedRebates, $compatibilities, $compatibleRebatesList
);

[$selectedRebates, $compatibleRebatesList] = $selectRebate(
    $compatibleRebatesList[2], $selectedRebates, $compatibilities, $compatibleRebatesList
);

[$selectedRebates, $compatibleRebatesList] = $selectRebate(
    $compatibleRebatesList[2], [$selectedRebates[0]], $compatibilities, $compatibleRebatesList
);

dd($compatibilities, $selectedRebates, $compatibleRebatesList);

dd($compatibilities);

//dd($possibleRebates);

// Listing of kind of descriptions of who is eligible and why
// http://www.moyerfordsales.com/ais.aspx?autoid=41906582
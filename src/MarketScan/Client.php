<?php

namespace DeliverMyRide\MarketScan;

use Carbon\Carbon;
use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private $guzzleClient;
    private $apiUrl;
    private $partnerID;
    private $accountNumber;

    public function __construct($username, $password)
    {
        $this->apiUrl = 'http://integration.marketscan.io/scan/rest/mscanservice.rst';
        $this->partnerID = '07957435-A7CC-4695-8922-109731B322C7';
        $this->accountNumber = '890000';

        $this->guzzleClient = new GuzzleClient([
            'connect_timeout' => 5,
        ]);
    }

    private function getVehicleID()
    {
        $vinResponse = $this->guzzleClient->get(
            "$this->apiUrl/?GetVehiclesByVIN/$this->partnerID/$this->accountNumber/$this->vin/True"
        );

        return json_decode((string) $vinResponse->getBody(), true)[0]['ID'];
    }

    public function getRebates()
    {
        $customerTypesResponse = $this->guzzleClient->get(
            "$this->apiUrl/?GetManufacturers/$this->partnerID/$this->accountNumber"
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

        $vehicleID = $this->getVehicleID();

        $response = $this->guzzleClient->post(
            "$this->apiUrl/?GetRebatesParams/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    // 2017-07-07T17:09:37.366Z
                    'DateTimeStamp' =>  Carbon::now()->toW3cString(),
                    'IncludeExpired' => false,
                    'VehicleID' => $vehicleID,
                    'ZIP' => $this->zipcode,
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

        return array_values($possibleRebates->toArray());
    }
}

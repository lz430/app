<?php

namespace DeliverMyRide\MarketScan;

use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private const TRANSACTION_TYPE_MAP = [
        // SpecialLease
        1 => ['lease'],
        // StandardLease
        2 => ['lease'],
        // SpecialRetail
        3 => ['cash', 'finance'],
        // StandardRetail
        4 => ['cash', 'finance'],
        // Lease
        10 => ['lease'],
        // Retail
        11 => ['cash', 'finance'],
        // Any
        1000 => ['cash', 'finance', 'lease'],
    ];
    private $client;
    private $apiUrl;
    private $partnerID;
    private $accountNumber;

    public function __construct($url, $partnerID, $accountNumber)
    {
        $this->apiUrl = $url;
        $this->partnerID = $partnerID;
        $this->accountNumber = $accountNumber;
        $this->client = new GuzzleClient;
    }

    public function getLeaseTerms($vin, $zipcode, $annualMileage, $downPayment, $msrp, $price)
    {
        // StateFeeTax
        $stateFeeTaxResponse = $this->client->get(
            "$this->apiUrl/?GetStateFeeTax/$this->partnerID/$this->accountNumber/$zipcode"
        );
        $stateFeeTax = json_decode((string) $stateFeeTaxResponse->getBody(), true)[0]['StateFeeTax'];

        // Market
        $marketResponse = $this->client->get(
            "$this->apiUrl/?GetMarketByZIP/$this->partnerID/$this->accountNumber/$zipcode"
        );
        $Market = ((string) $marketResponse->getBody());

        $retailResponse = $this->client->post(
            "$this->apiUrl/?RunScan/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    'LeasePart' => [
                        'AnnualMileage' => $annualMileage,
                        'CustomerCash' => $downPayment,
                    ],
                    'Market' => $Market,
                    'StateFeeTax' => $stateFeeTax,
                    'Vehicle' => [
                        'ID' => $this->getVehicleIDByVIN($vin),
                        'TotalMSRP' => $msrp,
                        'TotalDealerCost' => $price,
                    ],
                ],
            ]
        );

        return array_map(function ($term) {
            return [
                'term' => $term['Term'],
                'rate' => $term['Programs'][0]['BuyRate'],
                'payment' => $term['Programs'][0]['Payment'],
                'amount_financed' => $term['Programs'][0]['AmountFinanced'],
            ];
        }, json_decode((string) $retailResponse->getBody(), true)['Lease']['Terms'] ?? []);
    }

    public function getFinanceTerms($vin, $zipcode, $downPayment, $msrp, $price)
    {
        // StateFeeTax
        $stateFeeTaxResponse = $this->client->get(
            "$this->apiUrl/?GetStateFeeTax/$this->partnerID/$this->accountNumber/$zipcode"
        );
        $stateFeeTax = json_decode((string) $stateFeeTaxResponse->getBody(), true)[0]['StateFeeTax'];

        // Market
        $marketResponse = $this->client->get(
            "$this->apiUrl/?GetMarketByZIP/$this->partnerID/$this->accountNumber/$zipcode"
        );
        $Market = ((string) $marketResponse->getBody());

        $retailResponse = $this->client->post(
            "$this->apiUrl/?RunScan/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    'RetailPart' => [
                        'CustomerCash' => $downPayment,
                    ],
                    'ScanMode' => 1,
                    'Market' => $Market,
                    'StateFeeTax' => $stateFeeTax,
                    'Vehicle' => [
                        'ID' => $this->getVehicleIDByVIN($vin),
                        'TotalMSRP' => $msrp,
                        'TotalDealerCost' => $price,
                    ],
                ],
            ]
        );

        return array_map(function ($term) {
            return [
                'term' => $term['Term'],
                'rate' => $term['Programs'][0]['BuyRate'],
                'payment' => $term['Programs'][0]['Payment'],
                'amount_financed' => $term['Programs'][0]['AmountFinanced'],
            ];
        }, array_values(array_filter(
            json_decode((string) $retailResponse->getBody(), true)['Retail']['Terms'] ?? [],
            function ($term) {
                return isset($term['Programs'][0]['BuyRate']);
            }
        )));
    }


    public function getVehicleIDByVIN($vin)
    {
        $vinResponse = $this->client->get(
            "$this->apiUrl/?GetVehiclesByVIN/$this->partnerID/$this->accountNumber/$vin/True"
        );

        return json_decode((string) $vinResponse->getBody(), true)[0]['ID'];
    }

    public function getCompatibilities($vehicleID, $zipcode, $possibleRebates)
    {
        $compatibilityResponse = $this->client->post(
            "$this->apiUrl/?GetRebatesCompatibilityParams/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    'P' => [
                        // 2017-07-07T17:09:37.366Z
                        'DateTimeStamp' =>  Carbon::now()->toW3cString(),
                        'IncludeExpired' => false,
                        'VehicleID' => $vehicleID,
                        'ZIP' => $zipcode,
                    ],
                    'RebateValues' => array_map(function ($rebate) {
                        return [
                            'RebateID' => $rebate['id'],
                        ];
                    }, $possibleRebates),
                ],
            ]
        );

        return array_map(function ($compatibilityList) {
            return $compatibilityList['CompatibilityList'];
        }, json_decode((string) $compatibilityResponse->getBody(), true)['Compatibilities']);
    }

    public function getRebates($zipcode, $vin, $vehicleID, $selectedRebates = [])
    {
        $customerTypesResponse = $this->client->get(
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
                    throw new Exception('Missing mapping');
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

        $response = $this->client->post(
            "$this->apiUrl/?GetRebatesParams/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    // 2017-07-07T17:09:37.366Z
                    'DateTimeStamp' =>  Carbon::now()->toW3cString(),
                    'IncludeExpired' => false,
                    'VehicleID' => $vehicleID,
                    'ZIP' => $zipcode,
                ],
            ]
        );

        $possibleRebates = collect(json_decode((string) $response->getBody(), true)['Rebates'])
            ->map(function ($rebate) use ($customerTypeIDToCustomerTypeNameMap) {
                // add name to customer types
                $customerTypesWithNames = array_map(
                    function ($customerType) use ($customerTypeIDToCustomerTypeNameMap) {
                        return [
                            'customerTypeName' => $customerTypeIDToCustomerTypeNameMap[$customerType['ID']],
                            'id' => $customerType['ID'],
                            'autoSelect' => $customerType['AutoSelect'],
                        ];
                    },
                    $rebate['CustomerTypes'] ?? []
                );

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
                    'types' => self::TRANSACTION_TYPE_MAP[$rebate['TransactionType']],
                ];
            });

        return array_values($possibleRebates->toArray());
    }
}

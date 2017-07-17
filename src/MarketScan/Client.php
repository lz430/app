<?php

namespace DeliverMyRide\MarketScan;

use Carbon\Carbon;
use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private $client;
    private $apiUrl;
    private $partnerID;
    private $accountNumber;

    public function __construct()
    {
        $this->apiUrl = 'http://integration.marketscan.io/scan/rest/mscanservice.rst';
        $this->partnerID = '07957435-A7CC-4695-8922-109731B322C7';
        $this->accountNumber = '890000';
        $this->client = new GuzzleClient();
    }

    public function getVehicleIDByVIN($vin)
    {
        $vinResponse = $this->client->get(
            "$this->apiUrl/?GetVehiclesByVIN/$this->partnerID/$this->accountNumber/$vin/True"
        );

        return json_decode((string) $vinResponse->getBody(), true)[0]['ID'];
    }

    public function getCompatibleRebates($vehicleID, $zipcode, $possibleRebates, $selectedRebates)
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
                ]
            ]
        );

        $compatibilities = array_map(function ($compatibilityList) {
            return $compatibilityList['CompatibilityList'];
        }, json_decode((string) $compatibilityResponse->getBody(), true)['Compatibilities']);

        // we pick a rebate 1 at a time, after every selection we need to update the "compatible rebates list"
        $compatibleRebatesList = array_values($possibleRebates);

        $tempSelectedRebates = [];
        $nextCompatibleRebatesListIds = array_map(function ($compatibleRebates) {
            return $compatibleRebates['id'];
        }, $compatibleRebatesList);

        foreach ($selectedRebates as $selectedRebate) {
            [$tempSelectedRebates, $nextCompatibleRebatesListIds] = $this->selectRebate(
                $selectedRebate,
                $tempSelectedRebates,
                $compatibilities,
                $nextCompatibleRebatesListIds
            );
        }

        return [$tempSelectedRebates, $this->rebateIdsToRebates($nextCompatibleRebatesListIds, $compatibleRebatesList)];
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

        $response = $this->client->post(
            "$this->apiUrl/?GetRebatesParams/$this->partnerID/$this->accountNumber",
            [
                'json' => [
                    // 2017-07-07T17:09:37.366Z
                    'DateTimeStamp' =>  Carbon::now()->toW3cString(),
                    'IncludeExpired' => false,
                    'VehicleID' => $vehicleID,
                    'ZIP' => $zipcode,
                ]
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
                ];
            });

        return array_values($possibleRebates->toArray());
    }

    public function selectRebate($rebate, $selectedRebates, $compatibilities, $compatibleRebateIds)
    {
        // if it is already in $selectedRebates do nothing
        if (in_array($rebate, $selectedRebates)) {
            return [$selectedRebates, $compatibleRebateIds];
        }

        $withThisRebateIds = array_map(function ($rebate) {
            return $rebate['id'];
        }, array_merge($selectedRebates, [$rebate]));

        $nextCompatibilities = [];
        foreach ($compatibilities as $compatibleRebateIds) {
            if (!array_diff($withThisRebateIds, $compatibleRebateIds)) {
                // return new selected rebates and new compatibilityList
                $nextCompatibilities = array_unique(array_merge($nextCompatibilities, $compatibleRebateIds));
            }
        }

        if (!empty($nextCompatibilities)) {
            return [
                array_merge($selectedRebates, [$rebate]),
                $nextCompatibilities,
            ];
        } else {
            // Not in any compatibility lists
            if (count($withThisRebateIds) === 1) {
                return [[$rebate], [$rebate['id']]];
            }
        }

        // do nothing
        return [$selectedRebates, $compatibleRebateIds];
    }

    private function rebateIdsToRebates($compatibilityIds, $compatibleRebatesList)
    {
        return array_map(function ($compID) use ($compatibleRebatesList) {
            return array_first($compatibleRebatesList, function ($compatibleRebate) use ($compID) {
                return $compID === $compatibleRebate['id'];
            });
        }, $compatibilityIds);
    }
}

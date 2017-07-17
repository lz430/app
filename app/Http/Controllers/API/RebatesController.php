<?php

namespace App\Http\Controllers\API;

use App\Transformers\RebateTransformer;
use App\Http\Controllers\Controller;
use DeliverMyRide\MarketScan\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;
use League\Fractal\Serializer\DataArraySerializer;

class RebatesController extends Controller
{
    use ValidatesRequests;

    const RESOURCE_NAME = 'rebates';
    const TRANSFORMER = RebateTransformer::class;

    public function getRebates()
    {
        $this->validate(request(), [
            'zipcode' => 'required|exists:zipcodes,zipcode',
            'vin' => 'required|exists:deals,vin',
            'selected_rebate_ids' => 'required|array',
        ]);
        // vin, zipcode, rebate_ids


        $vin = request('vin');
        $zipcode = request('zipcode');
        $selectedRebateIds = request('selected_rebate_ids');

        $compatibleRebatesList = $client->getRebates();

        $selectedRebates = array_map(function ($selectedRebateId) use ($compatibleRebatesList) {
            return array_first($compatibleRebatesList, function ($compatibleRebate) use ($selectedRebateId) {
                return $selectedRebateId == $compatibleRebate['id'];
            });
        }, $selectedRebateIds);

// Get Customer Types


        $compatibilityResponse = $client->post(
            "$apiUrl/?GetRebatesCompatibilityParams/$partnerID/$accountNumber",
            [
                'json' => [
                    'P' => [
                        // 2017-07-07T17:09:37.366Z
                        'DateTimeStamp' =>  \Carbon\Carbon::now()->toW3cString(),
                        'IncludeExpired' => false,
                        'VehicleID' => $vehicleID,
                        'ZIP' => $zipcode,
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
//        dd($compatibilities);

// we pick a rebate 1 at a time, after every selection we need to update the "compatible rebates list"
        $compatibleRebatesList = array_values($possibleRebates->toArray());



        $tempSelectedRebates = [];
        $nextCompatibleRebatesList = $compatibleRebatesList;
        foreach ($selectedRebates as $selectedRebate) {
            [$tempSelectedRebates, $nextCompatibleRebatesList] = $this->selectRebate(
                $selectedRebate,
                $tempSelectedRebates,
                $compatibilities,
                $nextCompatibleRebatesList
            );
        }

// API endpoint: getCompatibleRebatesList : Zipcode -> VIN -> SelectedRebates[] -> CompatibleRebates[]
// Response: { compatibleRebates }
// from request we get a list of rebates the user has selected, and return the updated $compatibleRebatesList

//        [$selectedRebates, $compatibleRebatesList] = $selectRebate(
//            $compatibleRebatesList[0], $selectedRebates, $compatibilities, $compatibleRebatesList
//        );

        return fractal()
            ->collection($nextCompatibleRebatesList)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->respond();
    }

    private function selectRebate($rebate, $selectedRebates, $compatibilities, $compatibleRebatesList) {
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
    }
}

<?php

require __DIR__ . '/vendor/autoload.php';

$client = new \GuzzleHttp\Client();

$vin = '1FMCU0GD8HUC76968';

// get VehicleID by vin
$vinResponse = $client->get(
    "http://integration.marketscan.io/scan/rest/mscanservice.rst/?GetVehiclesByVIN/07957435-A7CC-4695-8922-109731B322C7/890000/$vin/True"
);

$vehicleID = json_decode((string) $vinResponse->getBody(), true)[0]['ID'];

$response = $client->post(
    'http://integration.marketscan.io/scan/rest/mscanservice.rst/?GetRebatesParams/07957435-A7CC-4695-8922-109731B322C7/890000',
    [
        'json' => [
            'DateTimeStamp' =>  "2017-07-07T17:09:37.366Z",
            'IncludeExpired' => false,
            'VehicleID' => $vehicleID,
            'ZIP' => 75703,
        ]
    ]
);

dd(collect(json_decode((string) $response->getBody(), true)['Rebates'])->filter(function ($rebate) {
    dd($rebate);
    return $rebate['Value']['Values'][0]['Value'] > 0;
})->map(function ($rebate) {
//    return
// $rebate;
    return [
        'rebate' => $rebate['Name'],
        'Value' => $rebate['Value']['Values'][0]['Value'],
    ];
}));
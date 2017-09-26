<?php

namespace DeliverMyRide\JATO;

use Carbon\Carbon;
use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private $guzzleClient;
    private $categories = [
        'cash' => 1,
        'finance' => 7,
        'lease' => 8,
    ];

    public function __construct($username, $password)
    {
        $this->guzzleClient = new GuzzleClient([
            'connect_timeout' => 5,
        ]);
        $this->authorize($username, $password);
    }

    public function makes()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'makes')->getBody(), true);
    }

    public function incentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "incentives/programs/$vehicleId", [
            'query' => [
                'zipCode' => $zipcode,
            ],
        ])->getBody(), true);
    }

    public function featuresByVehicleIdAndCategoryId($vehicleId, $categoryId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "features/$vehicleId/$categoryId?pageSize=100")->getBody(),
            true
        );
    }

    public function programsByVehicleIdAndCategoryIdAndZipCode($vehicleId, $categoryId, $zipcode)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "incentives/programs/$vehicleId", [
                'query' => [
                    'category' => 8,
                    'zipCode' => $zipcode,
                ],
            ])->getBody(),
            true
        );
    }

    public function featuresByVehicleIdAndCategoryIdAsync($vehicleId, $categoryId)
    {
        return $this->guzzleClient->requestAsync('GET', "features/$vehicleId/$categoryId?pageSize=100");
    }

    public function bestCashIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "incentives/bestOffer/$vehicleId/cash", [
            'query' => [
                'zipCode' => $zipcode,
            ],
        ])->getBody(), true)['programs'] ?? [];
    }

    public function bestFinanceIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "incentives/bestOffer/$vehicleId/finance", [
            'query' => [
                'zipCode' => $zipcode,
            ],
        ])->getBody(), true)['programs'] ?? [];
    }

    public function bestLeaseIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "incentives/bestOffer/$vehicleId/lease", [
            'query' => [
                'zipCode' => $zipcode,
            ],
        ])->getBody(), true)['programs'] ?? [];
    }

    public function incentivesByVehicleIdAndZipcodeWithSelected($vehicleId, $zipcode, $selected)
    {
        $first = array_first($selected);

        return json_decode((string) $this->guzzleClient->request('GET', "incentives/programs/$vehicleId/add/$first", [
            'query' => [
                'zipCode' => $zipcode,
                'addedPrograms' => implode(',', $selected),
            ],
        ])->getBody(), true);
    }

    public function makeByName($name)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "makes/$name")->getBody(), true);
    }

    public function modelByName($name)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "models/$name")->getBody(), true);
    }

    public function modelsByMakeName($makeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "makes/$makeName/models")->getBody(),
            true
        )['results'];
    }

    public function manufacturers()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'manufacturers')->getBody(), true)['results'];
    }

    public function manufacturerByName($name)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "manufacturers/$name")->getBody(), true);
    }

    public function makesByManufacturerUrlName($manufacturerName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "manufacturers/$manufacturerName/makes")->getBody(),
            true
        )['results'];
    }

    public function modelsVersionsByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "versions/$vehicleId")->getBody(),
            true
        );
    }

    public function modelsVersionsByModelName($modelName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/versions")->getBody(),
            true
        )['results'];
    }

    public function modelsVersionsByModelNameAsync($modelName)
    {
        return $this->guzzleClient->requestAsync('GET', "models/$modelName/versions");
    }

    public function optionsByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "options/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function vehicleById($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "vehicle/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function equipmentByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "equipment/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function decodeVin($vin)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "vin/decode/$vin"
            )->getBody(),
            true
        );
    }

    private function authorize($username, $password)
    {
        $response = json_decode((string) $this->guzzleClient->request('POST', 'https://auth.jatoflex.com/oauth/token', [
            'form_params' => [
                'username' => $username,
                'password' => $password,
                'grant_type' => 'password',
            ],
        ])->getBody(), true);

        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'https://api.jatoflex.com/api/en-us/',
            'headers' => [
                'Authorization' => $response['token_type'] . ' ' . $response['access_token'],
                'Subscription-Key' => 'e37102e58e4f42bf927743e6e92c41c3',
            ],
        ]);
    }
}

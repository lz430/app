<?php

namespace DeliverMyRide\JATO;

use Facades\App\JATO\Log;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Cache;

class Client
{
    private $guzzleClient;
    const tokenKey = 'JATO_AUTH_HEADER';

    public function __construct($username, $password)
    {
        $this->authorize($username, $password);
    }

    protected function get($path, $options = [])
    {
        try {
            return json_decode((string) $this->guzzleClient->request('GET', $path, $options)->getBody(), true);
        } catch (ClientException $e) {
            // @todo handle ONLY 401s.. otherwise throw up again
        }
    }

    public function makes()
    {
        return $this->get('makes');
    }

    public function incentivesByVehicleIdAndZipcode($vehicleId, $zipcode, $additionalParams = [])
    {
        try {
            return $this->get("incentives/programs/$vehicleId", [
                'query' => array_merge([
                    'zipCode' => $zipcode,
                    ], $additionalParams)
            ]);
        } catch (ClientException $e) {
            Log::debug("Vehicle ID $vehicleId returns no incentives. URL: incentives/programs/$vehicleId?zipCode=$zipcode");
            return [];
        }
    }

    public function featuresByVehicleIdAndCategoryId($vehicleId, $categoryId)
    {
        return $this->get("features/$vehicleId/$categoryId?pageSize=100");
    }

    public function featuresByVehicleIdAndCategoryIdAsync($vehicleId, $categoryId)
    {
        // @todo handle 401 here too I guess?
        return $this->guzzleClient->requestAsync('GET', "features/$vehicleId/$categoryId?pageSize=100");
    }

    public function bestCashIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return $this->get("incentives/bestOffer/$vehicleId/cash", [
                'query' => ['zipCode' => $zipcode]
            ])['programs'] ?? [];
    }

    public function bestFinanceIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return $this->get("incentives/bestOffer/$vehicleId/finance", [
                'query' => ['zipCode' => $zipcode]
            ])['programs'] ?? [];
    }

    public function bestLeaseIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        return $this->get("incentives/bestOffer/$vehicleId/lease", [
                'query' => ['zipCode' => $zipcode]
            ])['programs'] ?? [];
    }

    public function incentivesByVehicleIdAndZipcodeWithSelected($vehicleId, $zipcode, $selected)
    {
        $first = array_first($selected);

        return $this->get(
            "incentives/programs/$vehicleId/add/$first",
            [
                'query' => [
                    'zipCode' => $zipcode,
                    'addedPrograms' => implode(',', $selected),
                ]
            ]
        );
    }

    public function makeByName($name)
    {
        return $this->get("makes/$make");
    }

    public function modelByName($modelName)
    {
        return $this->get("models/" . $this->makeModelNameUrlFriendly($modelName));
    }

    public function modelsByMakeName($makeName)
    {
        return $this->get("makes/$makeName/models")['results'];
    }

    public function manufacturers()
    {
        return $this->get("manufacturers")['results'];
    }

    public function manufacturerByName($name)
    {
        return $this->get("manufacturers/$name");
    }

    public function makesByManufacturerUrlName($manufacturerName)
    {
        return $this->get("manufacturers/$manufacturerName/makes")['results'];
    }

    public function modelsVersionsByVehicleId($vehicleId)
    {
        return $this->get("versions/$vehicleId");
    }

    public function modelsVersionsByModelName($modelName)
    {
        $modelName = $this->makeModelNameUrlFriendly($modelName);
        return $this->get("models/$modelName/versions")['results'];
    }

    public function modelsVersionsByModelNameAsync($modelName)
    {
        // @todo handle 401 here i guess
        $modelName = $this->makeModelNameUrlFriendly($modelName);
        return $this->guzzleClient->requestAsync('GET', "models/$modelName/versions");
    }

    public function optionsByVehicleId($vehicleId)
    {
        return $this->get("options/$vehicleId");
    }

    public function vehicleById($vehicleId)
    {
        return $this->get("vehicle/$vehicleId");
    }

    public function equipmentByVehicleId($vehicleId)
    {
        return $this->get("equipment/$vehicleId");
    }

    public function decodeVin($vin)
    {
        return $this->get("vin/decode/$vin");
    }

    private function makeModelNameUrlFriendly($modelName)
    {
        return strtolower(str_replace(' ', '-', $modelName));
    }

    private function authorize($username, $password)
    {
        if (! Cache::has(self::tokenKey)) {
            $this->refreshAuthorizationToken($username, $password);
        }

        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'https://api.jatoflex.com/api/en-us/',
            'headers' => [
                // 'Authorization' => Cache::get(self::tokenKey),
                'Authorization' => 'abc',
                'Subscription-Key' => config('services.jato.subscription_key'),
            ],
        ]);
    }

    private function refreshAuthorizationToken($username, $password)
    {
        $guzzleClient = new GuzzleClient(['connect_timeout' => 5]);

        $response = json_decode((string) $guzzleClient->request('POST', 'https://auth.jatoflex.com/oauth/token', [
            'form_params' => [
                'username' => $username,
                'password' => $password,
                'grant_type' => 'password',
            ],
        ])->getBody(), true);

        Cache::put(
            self::tokenKey,
            $response['token_type'] . ' ' . $response['access_token'],
            ($response['expires_in'] / 60) - 1
        );
    }
}

<?php

namespace DeliverMyRide\JATO;

use Facades\App\JATO\Log;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class Client
{
    private $guzzleClient;
    const TOKEN_KEY = 'JATO_AUTH_HEADER';
    private $retryCount = 0;

    private $username;
    private $password;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;

        $this->authorize();
    }

    protected function get($path, $options = [], $async = false)
    {
        try {
            if ($async) {
                return $this->guzzleClient->requestAsync('GET', $path, $options);
            } else {
                return json_decode((string) $this->guzzleClient->request('GET', $path, $options)->getBody(), true);
            }
        } catch (ClientException $e) {
            if ($e->getCode() === 401) {
                if ($this->retryCount > 2) {
                    Log::error('Three failures authenticating in a row. Quitting out. Message: ' . $e->getMessage());

                    throw $e;
                }

                $this->retryCount++;
                $this->authorize();

                return $this->get($path, $options, $async);
            }

            throw $e;
        }
    }

    public function makes()
    {
        return $this->get('makes');
    }

    public function makeByName($name)
    {
        return $this->get("makes/$name");
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
        $modelName = $this->makeModelNameUrlFriendly($modelName);
        return $this->get("models/$modelName/versions", [], true);
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

    public function featuresByVehicleIdAndCategoryId($vehicleId, $categoryId)
    {
        return $this->get("features/$vehicleId/$categoryId?pageSize=100");
    }

    public function featuresByVehicleIdAndCategoryIdAsync($vehicleId, $categoryId)
    {
        return $this->get("features/$vehicleId/$categoryId?pageSize=100", [], true);
    }

    // @todo : KEEP THIS ONE! it's for lease rates
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
            return ['targets' => []];
        }
    }

    public function targetsByVehicleIdAndZipcode($vehicleId, $zipcode)
    {
        try {
            return $this->get("incentives/bestOffer/$vehicleId/targets", [
                'query' => [
                    'zipCode' => $zipcode,
                ]
            ]);
        } catch (ClientException $e) {
            Log::debug("Unable to get targets for Vehicle ID $vehicleId. URL: incentives/bestOffer/$vehicleId/targets");
        }

    }

    public function bestOffer($vehicleId, $paymentType, $zipcode, $targets)
    {
        try {
            return $this->get("incentives/bestOffer/$vehicleId/$paymentType", [
                'query' => array_merge([
                    'zipCode' => $zipcode,
                    'targets' => $targets
                ])
            ]);
        } catch (ClientException $e) {
            Log::debug("Vehicle ID $vehicleId returns no Best Offers. URL: incentives/bestOffer/$vehicleId/$paymentType?zipCode=$zipcode&targets=$targets");
            return JsonResponse::create(['totalValue' => 0, 'programs' => []]);
        }
    }

    protected function makeModelNameUrlFriendly($modelName)
    {
        return strtolower(str_replace(' ', '-', $modelName));
    }

    protected function authorize()
    {
        if (! Cache::has(self::TOKEN_KEY)) {
            $this->refreshAuthorizationToken();
        }

        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'https://api.jatoflex.com/api/en-us/',
            'headers' => [
                'Authorization' => Cache::get(self::TOKEN_KEY),
                'Subscription-Key' => config('services.jato.subscription_key'),
            ],
        ]);
    }

    private function refreshAuthorizationToken()
    {
        $guzzleClient = new GuzzleClient(['connect_timeout' => 5]);

        $response = json_decode((string) $guzzleClient->request('POST', 'https://auth.jatoflex.com/oauth/token', [
            'form_params' => [
                'username' => $this->username,
                'password' => $this->password,
                'grant_type' => 'password',
            ],
        ])->getBody(), true);

        Cache::put(
            self::TOKEN_KEY,
            $response['token_type'] . ' ' . $response['access_token'],
            ($response['expires_in'] / 60) - 1
        );
    }
}

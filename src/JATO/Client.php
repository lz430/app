<?php

namespace DeliverMyRide\JATO;

use Facades\App\JATO\Log;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Cache;

class Client
{
    // Types that should be excluded for every best offer call
    const TYPE_BLACKLIST = [
        7, // Cash Certificate Coupon ** Coupon **
        11, // Gift
        14, // Payment/Fee Waiver
        15, // Package Option Discount
        16, // Trade-in Allowance
        25, // Cash on % of Objective
        26, // Enhanced Rate/APR
        27, // Enhanced Rate with Cash or Fee Waiver
        28, // Other Financing
        29, // Enhanced Rate and Residual
        30, // Enhanced Rate/Money Factor
        37, // Dealer Spin
        44, // Flat Pay
        47, // Direct/Private Offer ** Coupon **
        50, // Final Pay
        52, // Aged Inventory Bonus Cash
    ];
    const TOKEN_KEY = 'JATO_AUTH_HEADER';

    private $guzzleClient;
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

                Log::info('Re-authorizing with JATO.');

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
        return $this->get("makes/" . $this->makeFancyNameUrlFriendly($name));
    }

    public function modelByName($modelName)
    {
        return $this->get("models/" . $this->makeFancyNameUrlFriendly($modelName));
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
        return $this->get("manufacturers/" . $this->makeFancyNameUrlFriendly($name));
    }

    public function makesByManufacturerUrlName($manufacturerName)
    {
        $modelName = $this->makeFancyNameUrlFriendly($modelName);
        return $this->get("manufacturers/$manufacturerName/makes")['results'];
    }

    public function modelsVersionsByVehicleId($vehicleId)
    {
        return $this->get("versions/$vehicleId");
    }

    public function modelsVersionsByModelName($modelName)
    {
        $modelName = $this->makeFancyNameUrlFriendly($modelName);
        return $this->get("models/$modelName/versions")['results'];
    }

    public function modelsVersionsByModelNameAsync($modelName)
    {
        $modelName = $this->makeFancyNameUrlFriendly($modelName);
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

    // KEEP THIS ONE! it's for lease rates
    public function incentivesByVehicleIdAndZipcode($vehicleId, $zipcode, $additionalParams = [])
    {
        $cacheKey = 'JATO::Client::incentivesByVehicleIdAndZipcode.'.$vehicleId.'.'.$zipcode;

        if (Cache::has($cacheKey)) {
            Log::debug("Vehicle ID $vehicleId cache HIT ($cacheKey)");
            return Cache::get($cacheKey);
        }

        try {
            Log::debug("Vehicle ID $vehicleId cache MISS ($cacheKey)");

            $response = $this->get("incentives/programs/$vehicleId", [
                'query' => array_merge([
                    'zipCode' => $zipcode,
                    ], $additionalParams)
            ]);

            Cache::put($cacheKey, $response, count($response) > 0 ? 60 : 15);

            return $response;
        } catch (ClientException $e) {
            Log::debug("Vehicle ID $vehicleId returns no incentives. URL: incentives/programs/$vehicleId?zipCode=$zipcode, token:".Cache::get(self::TOKEN_KEY).", error: ".$e->getMessage());
            Cache::put($cacheKey, [], 5);
            return [];
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
            Log::debug("Unable to get targets for Vehicle ID $vehicleId. URL: incentives/bestOffer/$vehicleId/targets, token:".Cache::get(self::TOKEN_KEY).", error: ".$e->getMessage());
            return [];
        }
    }

    public function bestOffer($vehicleId, $paymentType, $zipcode, $targets)
    {
        try {
            return $this->get("incentives/bestOffer/$vehicleId/$paymentType", [
                'query' => array_merge([
                    'zipCode' => $zipcode,
                    'targets' => $targets,
                    'excludeTypes' => implode(',', self::TYPE_BLACKLIST),
                ])
            ]);
        } catch (ClientException $e) {
            Log::debug("Vehicle ID $vehicleId returns no Best Offers. URL: incentives/bestOffer/$vehicleId/$paymentType?zipCode=$zipcode&targets=$targets, token:".Cache::get(self::TOKEN_KEY).", error: ".$e->getMessage());
            return ['totalValue' => 0, 'programs' => []];
        }
    }

    protected function makeFancyNameUrlFriendly($modelName)
    {
        return strtolower(str_replace([' ', '%20'], ['-', '-'], $modelName));
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

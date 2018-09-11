<?php

namespace DeliverMyRide\JATO;

use DeliverMyRide\Common\ApiClient;
use Facades\App\JATO\Log;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

/**
 * Class JatoClient
 * @package DeliverMyRide\JATO
 *
 * An API wrapper around the entire JATO api.
 *
 * @see https://www.jatoflex.com/docs/services/
 */
class JatoClient extends ApiClient
{

    const TOKEN_KEY = 'JATO_AUTH_TOKEN';

    public $token;

    /** @var string $username */
    protected $username;

    /** @var string $password */
    protected $password;

    /** @var string baseUrl */
    protected $baseUrl;

    //
    // Services
    public $vin;
    public $manufacturer;
    public $make;
    public $model;
    public $vehicle;
    public $version;
    public $equipment;
    public $option;
    public $feature;
    public $incentive;
    public $standard;


    /**
     * JatoClient constructor.
     * @param string $username
     * @param string $password
     */
    public function __construct(string $username, string $password)
    {
        parent::__construct();

        // Setup Services
        $this->vin = new Service\VinService($this);
        $this->manufacturer = new Service\ManufacturerService($this);
        $this->make = new Service\MakeService($this);
        $this->model = new Service\ModelService($this);
        $this->vehicle = new Service\VehicleService($this);
        $this->version = new Service\VersionService($this);
        $this->equipment = new Service\EquipmentService($this);
        $this->option = new Service\OptionService($this);
        $this->feature = new Service\FeatureService($this);
        $this->incentive = new Service\IncentiveService($this);
        $this->standard = new Service\StandardService($this);

        // Auth & Whatnot
        $this->username = $username;
        $this->password = $password;
        $this->token = $this->getAuthorizationToken();

        $this->baseUrl = "https://api.jatoflex.com/api/en-us";
    }

    /**
     * @return array
     */
    protected function getRequestHeaders()
    {

        //
        // Typically we'd put something like this in the constructor...
        // But this class is used on the import which runs for 4+ hours, so we validate the
        // token on every request in order to ensure it doesn't expire in the middle.

        // refresh token if it will expire within the next 10 seconds.
        if (!$this->token || strtotime($this->token->expires_on) < (time() + 10)) {
            $this->refreshAuthorizationToken();
        }

        $headers = [
            'Authorization' => $this->token->token_type . ' ' . $this->token->access_token,
            'Subscription-Key' => config('services.jato.subscription_key'),
        ];
        return $headers;
    }

    /**
     * Process names into something jato likes
     *
     * @param string $modelName
     * @return string
     */
    public function makeFancyNameUrlFriendly(string $modelName) : string
    {
        return strtolower(str_replace([' ', '%20'], ['-', '-'], $modelName));
    }

    /**
     * Fetch token from cache
     * @return mixed
     */
    public function getAuthorizationToken() {
        return Cache::get(self::TOKEN_KEY, FALSE);
    }

    /**
     * Refreshes the auth token using username and password. Stores the new token info in cache
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function refreshAuthorizationToken()
    {
        //
        // Request new token
        $client = new Client(['connect_timeout' => 5]);
        $response = $client->request('POST', 'https://auth.jatoflex.com/oauth/token', [
            'form_params' => [
                'username' => $this->username,
                'password' => $this->password,
                'grant_type' => 'password',
            ],
        ]);

        $response = json_decode($response->getBody());

        //
        // Store new token
        $this->token = $response;
        Cache::put(self::TOKEN_KEY, $response, ($response->expires_in / 60) - 5);
    }
}

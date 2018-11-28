<?php

namespace DeliverMyRide\Fuel;

use DeliverMyRide\Common\ApiClient;

class FuelClient extends ApiClient
{
    /** @var string api key */
    protected $apiKey;

    /** @var string baseUrl */
    protected $baseUrl;

    public $product;
    public $vehicle;

    /**
     * @param $apiKey
     */
    public function __construct(string $apiKey)
    {
        parent::__construct();

        // Setup services
        $this->product = new Service\ProductService($this);
        $this->vehicle = new Service\VehicleService($this);

        // Configure
        $this->apiKey = $apiKey;
        $this->baseUrl = 'https://api.fuelapi.com/v1/json';
    }

    protected function getRequestHeaders()
    {
        $credentials = base64_encode($this->apiKey.':');

        return [
            'Accept' => 'application/json',
            'Authorization' => 'Basic '.$credentials,
        ];
    }
}

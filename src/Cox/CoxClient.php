<?php

namespace DeliverMyRide\Cox;

use DeliverMyRide\Common\ApiClient;

/**
 * Class CoxClient
 * @package DeliverMyRide\Cox

 * @see https://incentives.homenetiol.com/v2.4/metadata
 *  For information about endpoints
 */
class CoxClient extends ApiClient
{
    /** @var string api key */
    protected $apiKey;

    /** @var string baseUrl */
    protected $baseUrl;

    public $vin;
    public $hashcode;
    public $program;
    public $vehicle;

    /**
     * CoxClient constructor.
     * @param $apiKey
     */
    public function __construct(string $apiKey)
    {
        parent::__construct();

        // Setup services
        $this->vin = new Service\VinService($this);
        $this->hashcode = new Service\HashcodeService($this);
        $this->program = new Service\ProgramService($this);
        $this->vehicle = new Service\VehicleService($this);

        // Configure
        $this->apiKey = $apiKey;
        $this->baseUrl = "https://incentives.homenetiol.com/v2.4/json/reply";
    }

    protected function getRequestHeaders() {
        return [
            'Accept' => 'application/json',
            'AIS-ApiKey' => $this->apiKey,
        ];
    }

}
<?php

namespace DeliverMyRide\RIS;

use DeliverMyRide\Common\ApiClient;

/**
 * Class RISClient.
 * @see https://incentives.homenetiol.com/v2.5/metadata
 *  For information about endpoints
 */
class RISClient extends ApiClient
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
     * RISClient constructor.
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
        $this->baseUrl = 'https://incentives.homenetiol.com/v2.5/json/reply';
    }

    protected function getRequestHeaders()
    {
        return [
            'Accept' => 'application/json',
            'AIS-ApiKey' => $this->apiKey,
        ];
    }
}

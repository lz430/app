<?php

namespace DeliverMyRide\Cox;

use DeliverMyRide\Common\ApiClient;

/**
 * Class CoxClient
 * @package DeliverMyRide\Cox

 * @see https://incentives.homenetiol.com/v2.2/metadata
 *  For information about endpoints
 */
class CoxClient extends ApiClient
{
    /** @var string api key */
    protected $apiKey;

    /** @var string baseUrl */
    protected $baseUrl;

    /** @var Service\TestService $test */
    public $test;

    /**
     * CoxClient constructor.
     * @param $apiKey
     */
    public function __construct(string $apiKey)
    {
        parent::__construct();

        // Setup services
        $this->test = new Service\TestService($this);

        // Configure
        $this->apiKey = $apiKey;
        $this->baseUrl = "https://incentives.homenetiol.com/v2.2/json/reply";
    }

    protected function getRequestHeaders() {
        return [
            'Accept' => 'application/json',
            'AIS-ApiKey' => $this->apiKey,
        ];
    }

}
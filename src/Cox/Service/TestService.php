<?php

namespace DeliverMyRide\Cox\Service;

use DeliverMyRide\Cox\CoxClient;

class TestService {

    /** @var \DeliverMyRide\Cox\CoxClient */
    private $client;


    /**
     * TestService constructor.
     * @param \DeliverMyRide\Cox\CoxClient $client
     */
    public function __construct(CoxClient $client)
    {
        $this->client = $client;
    }

    /**
     * GetAdvertisedDealScenarios
     * @see https://incentives.homenetiol.com/v2.2/jsv/metadata?op=GetAdvertisedDealScenarios
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getAdvertisedDealScenarios() {
        return $this->client->get("GetAdvertisedDealScenarios");
    }

}

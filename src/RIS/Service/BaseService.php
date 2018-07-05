<?php

namespace DeliverMyRide\Cox\Service;

use DeliverMyRide\Cox\CoxClient;

abstract class BaseService {


    /** @var \DeliverMyRide\Cox\CoxClient */
    protected $client;


    /**
     * TestService constructor.
     * @param \DeliverMyRide\Cox\CoxClient $client
     */
    public function __construct(CoxClient $client)
    {
        $this->client = $client;
    }

}
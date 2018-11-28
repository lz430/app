<?php

namespace DeliverMyRide\Fuel\Service;

use DeliverMyRide\Fuel\FuelClient;

abstract class BaseService
{
    /** @var \DeliverMyRide\Fuel\FuelClient */
    protected $client;

    /**
     * @param \DeliverMyRide\Fuel\FuelClient $client
     */
    public function __construct(FuelClient $client)
    {
        $this->client = $client;
    }
}

<?php

namespace DeliverMyRide\DataDelivery\Service;

use DeliverMyRide\DataDelivery\DataDeliveryClient;

abstract class BaseService {

    /** @var \DeliverMyRide\DataDelivery\DataDeliveryClient */
    protected $client;


    /**
     * @param DataDeliveryClient $client
     */
    public function __construct(DataDeliveryClient $client)
    {
        $this->client = $client;
    }



}
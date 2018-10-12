<?php

namespace DeliverMyRide\JATO\Service;

use DeliverMyRide\JATO\JatoClient;

abstract class BaseService {

    /** @var \DeliverMyRide\JATO\JatoClient */
    protected $client;

    /**
     * FeatureService constructor.
     * @param \DeliverMyRide\JATO\JatoClient $client
     */
    public function __construct(JatoClient $client)
    {
        $this->client = $client;
    }

}
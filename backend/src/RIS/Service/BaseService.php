<?php

namespace DeliverMyRide\RIS\Service;

use DeliverMyRide\RIS\RISClient;

abstract class BaseService
{
    /** @var \DeliverMyRide\RIS\RISClient */
    protected $client;

    /**
     * TestService constructor.
     * @param \DeliverMyRide\RIS\RISClient $client
     */
    public function __construct(RISClient $client)
    {
        $this->client = $client;
    }
}

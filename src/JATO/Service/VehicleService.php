<?php

namespace DeliverMyRide\JATO\Service;

class VehicleService extends BaseService
{

    /**
     * get
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55aff4c074be0902ecb19158?
     * @param string $vehicleId
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId)
    {
        return $this->client->get("vehicle/{$vehicleId}");
    }

}

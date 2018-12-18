<?php

namespace DeliverMyRide\JATO\Service;

class EquipmentService extends BaseService
{
    /**
     * get.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55b8f76f74be09132c0e18c0?
     * @param string $vehicleId
     * @return mixed
     */
    public function get(string $vehicleId)
    {
        return $this->client->get("equipment/{$vehicleId}");
    }
}

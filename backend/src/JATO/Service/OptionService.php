<?php

namespace DeliverMyRide\JATO\Service;

class OptionService extends BaseService
{
    /**
     * get.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55bbd61174be0903a820e304?
     * @param string $vehicleId
     * @param string $type
     * @return mixed
     */
    public function get(string $vehicleId, string $type = '')
    {
        if ($type) {
            $path = "options/{$vehicleId}/type/{$type}";
        } else {
            $path = "options/{$vehicleId}";
        }

        return $this->client->get($path);
    }
}

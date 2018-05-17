<?php

namespace DeliverMyRide\JATO\Service;

class OptionService extends BaseService
{

    /**
     * get
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55bbd61174be0903a820e304?
     * @param string $vehicleId
     * @param string $type
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId, $type = '')
    {
        if ($type) {
            $path = "options/{$vehicleId}";
        } else {
            $path = "options/{$vehicleId}/type/{$type}";
        }

        return $this->client->get($path);
    }

}

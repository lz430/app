<?php

namespace DeliverMyRide\JATO\Service;

class FeatureService extends BaseService
{
    /**
     * get
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55b8f76f74be09132c0e18c0?
     * @param string $vehicleId
     * @param string $categoryId
     * @param int $page
     * @param int $page_size
     * @param bool $async
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId, string $categoryId = '', int $page = 1, int $page_size = 20, bool $async = FALSE)
    {
        if ($categoryId) {
            $path = "features/{$vehicleId}/{$categoryId}";
        } else {
            $path = "features/{$vehicleId}";
        }

        return $this->client->get($path, [
            'page' => $page,
            'pageSize' => $page_size
        ], $async);
    }

}

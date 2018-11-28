<?php

namespace DeliverMyRide\JATO\Service;

class StandardService extends BaseService
{
    /**
     * get.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55b8f76f74be09132c0e18c0?
     * @param string $vehicleId
     * @param string $categoryId
     * @param string $schemaId
     * @param int $page
     * @param int $page_size
     * @param bool $async
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId, string $categoryId = '', $schemaId = '', int $page = 1, int $page_size = 20, bool $async = false)
    {
        if ($categoryId) {
            $path = "standard/{$vehicleId}/{$categoryId}";
        } elseif ($schemaId) {
            $path = "standard/{$vehicleId}/schemaid/{$schemaId}";
        } else {
            $path = "standard/{$vehicleId}";
        }

        return $this->client->get($path, [
            'page' => $page,
            'pageSize' => $page_size,
        ], $async);
    }
}

<?php

namespace DeliverMyRide\JATO\Service;

class VinService extends BaseService
{
    /**
     * decode Vin.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55e8650374be0914c0784d26?
     * @param string $vin
     * @param array $query
     *   ['modelCode' => '', 'trimName' => '', 'optionCodes' => ''];
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function decode(string $vin, array $query = [])
    {
        return $this->client->get("vin/decode/{$vin}", $query);
    }

    /**
     * validate Vin.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/56d71c8174be0909e4aaf1e4?
     * @param string $vin
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function validate(string $vin)
    {
        return $this->client->get("vin/validate/{$vin}");
    }

    /**
     * bulk decode Vin.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/5845771474be090b1c89b283?
     * @param array $vins
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function decodeBulk(array $vins)
    {
        return $this->client->post('vin/decode', $vins);
    }

    /**
     * decode vin features.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/56d71c8174be0909e4aaf1e4?
     * @param string $vinVersionId
     * @param string $category
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function decodeVinFeatures(string $vinVersionId, string $category = 'all')
    {
        return $this->client->get("vin/features/{$vinVersionId}/{$category}");
    }
}

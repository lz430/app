<?php

namespace DeliverMyRide\RIS\Service;


class VinService extends BaseService {

    /**
     * VIN decoder
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=DecodeVIN
     * @param string $vin
     * @param array $hints
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * {"vin":"String","vehicleHints":{"String":"String"}}
     */
    public function decode(string $vin, array $hints = []) {
        return $this->client->post("decodevin", [
            'vin' => $vin,
            'vehicleHints' => $hints
        ]);
    }

}

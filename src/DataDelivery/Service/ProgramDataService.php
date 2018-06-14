<?php

namespace DeliverMyRide\DataDelivery\Service;


class ProgramDataService extends BaseService {

    /**
     * @param string $vin
     * @param string $zipcode
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     */
    public function get(string $vin, string $zipcode) {
        $data = [
            'action' => 'getDescVehicleProgramData',
            'VIN' => $vin,
            'CustomerZip' => $zipcode,
            'DealerZip' => $zipcode
        ];
        return $this->client->post("", $data);
    }

}

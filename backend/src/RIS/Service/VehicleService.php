<?php

namespace DeliverMyRide\RIS\Service;

class VehicleService extends BaseService
{
    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=GetVehicleGroupHashcodes
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function hashcodes()
    {
        return $this->client->get('getvehiclegrouphashcodes');
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=GetVehicleHints
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function hints()
    {
        return $this->client->get('getvehiclehints');
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=GetVehicleGroupByID
     * @param  string $vehicleId
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId)
    {
        return $this->client->get("getvehiclegroupbyid/{$vehicleId}");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByVehicleAndRegionID
     * @param  string $vin
     * @param  string $regionId
     * @param  array $dealScenarios
     * @param  array $vehicleHints
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function findByVehicleAndRegionID(string $vin,
                                             string $regionId,
                                             array $dealScenarios = [],
                                             array $vehicleHints = [])
    {
        $data = [
            'regionID' => $regionId,
            'vin' => $vin,
        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        if (count($vehicleHints)) {
            $data['vehicleHints'] = $vehicleHints;
        }

        return $this->client->post('findvehiclegroupsbyvehicleandregionid', $data);
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByVehicleAndPostalcode
     * @param  string $vin
     * @param  string $postalCode
     * @param  array $dealScenarios
     * @param  array $vehicleHints
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function findByVehicleAndPostalcode(string $vin,
                                               string $postalCode,
                                               array $dealScenarios = [],
                                               array $vehicleHints = [])
    {
        $data = [
            'postalcode' => $postalCode,
            'vin' => $vin,
        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        if (count($vehicleHints)) {
            $data['vehicleHints'] = $vehicleHints;
        }

        return $this->client->post('findvehiclegroupsbyvehicleandpostalcode', $data);
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByListOfVehicleAndPostalcode
     * @param  array $list
     * @param  array $dealScenarios
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * {"vehicleAndPostalcodeFilters":[{"postalcode":"String","vin":"String","vehicleHints":{"String":"String"}}],"dealScenarios":[0]}
     */
    public function findByListVehicleAndPostalcode(array $list,
                                                   array $dealScenarios = [])
    {
        $data = [
            'vehicleAndPostalcodeFilters' => $list,
        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        return $this->client->post('findvehiclegroupsbylistofvehicleandpostalcode', $data);
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByListOfVehicleAndRegionID
     * @param  array $list
     * @param  array $dealScenarios
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * {"vehicleAndRegionIDFilters":[{"regionID":0,"vin":"String","vehicleHints":{"String":"String"}}],"dealScenarios":[0]}
     */
    public function findByListVehicleAndRegionID(array $list,
                                                 array $dealScenarios = [])
    {
        $data = [
            'vehicleAndRegionIDFilters' => $list,
        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        return $this->client->post('findvehiclegroupsbylistofvehicleandregionid', $data);
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByMakeAndRegionID
     * @param  string $make
     * @param  string $regionId
     * @param  array $dealScenarios
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function findByMakeAndRegionID(string $make,
                                          string $regionId,
                                          array $dealScenarios = [])
    {
        $data = [
            'regionID' => $regionId,
            'makeName' => $make,

        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        return $this->client->post('findvehiclegroupsbymakeandregionid', $data);
    }

    /**
     * @see https://incentives.homenetiol.com/v2.5/json/metadata?op=FindVehicleGroupsByMakeAndPostalcode
     * @param  string $make
     * @param  string $postalCode
     * @param  array $dealScenarios
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function findByMakeAndPostalcode(string $make,
                                            string $postalCode,
                                            array $dealScenarios = [])
    {
        $data = [
            'postalcode' => $postalCode,
            'makeName' => $make,
        ];

        if (count($dealScenarios)) {
            $data['dealScenarios'] = $dealScenarios;
        }

        return $this->client->post('findvehiclegroupsbymakeandpostalcode', $data);
    }
}

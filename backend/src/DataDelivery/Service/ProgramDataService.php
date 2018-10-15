<?php

namespace DeliverMyRide\DataDelivery\Service;


class ProgramDataService extends BaseService
{


    /**
     * @param \SimpleXMLElement $element
     * @return \stdClass
     */
    private function parseResponse(\SimpleXMLElement $element): \stdClass
    {
        $response = new \stdClass();
        $response->status = (string)$element->status->attributes()['returnCode'];
        if (isset($element->status->attributes()['errorMsg'])) {
            $response->error = (string)$element->status->attributes()['errorMsg'];
            return $response;
        }

        $response->affinities = new \stdClass();

        foreach ($element->Affinities->Affinity as $affinity) {
            $response->affinities->{$affinity->attributes()['affinityID']} = (string)$affinity->attributes()['affinityDesc'];
        }

        if (!isset($element->describedVehicleGroup)) {
            $response->vehicles = [];

            foreach ($element->describedVehicle as $vehicleData) {
                $vehicle = [];
                $this->client->mungeAttributesIntoArray($vehicle, $vehicleData);
                $this->client->mungeChildrenIntoArray($vehicle, $vehicleData);
                $response->vehicles[] = (object)$vehicle;
            }

        } else {
            $response->groups = [];
            foreach ($element->describedVehicleGroup as $groupData) {
                $group = [];
                $this->client->mungeAttributesIntoArray($group, $groupData);
                $this->client->mungeChildrenIntoArray($group, $groupData, ['describedVehicle' => 'vehicles']);
                $response->groups[] = (object)$group;
            }
        }

        return $response;
    }

    /**
     * @param string $vin
     * @param string $customerZip
     * @param string $dealerZip
     * @param bool $extended
     * @param array $searchData
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * @see http://xmlasvr.aisrebates.com/ais_xml/test.html (request 1)
     *
     */
    public function get(string $vin, string $customerZip, string $dealerZip, bool $extended = false, array $searchData = [])
    {
        $data = [
            'action' => 'getDescVehicleProgramData',
            'VIN' => $vin,
            'CustomerZip' => $customerZip,
            'DealerZip' => $dealerZip,
            'extended' => ($extended ? "yes" : "no"),
        ];

        $data = array_merge($data, $searchData);

        $response = $this->client->post("", $data);

        if ($response) {
            return $this->parseResponse($response);
        }

        return null;
    }

}

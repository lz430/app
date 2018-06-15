<?php

namespace DeliverMyRide\DataDelivery\Service;


class ProgramDataService extends BaseService
{

    /**
     * @param $array
     * @param \SimpleXMLElement $element
     */
    private function mungeAttributesIntoArray(&$array, \SimpleXMLElement $element)
    {
        foreach ($element->attributes() as $k => $v) {
            $array[(string)$k] = (string)$v;
        }
    }

    private function mungeChildrenIntoArray(&$array, \SimpleXMLElement $element, $parent_keys = [])
    {

        foreach ($element->children() as $key => $childData) {
            if (isset($parent_keys[$key])) {
                $parent_key = $parent_keys[$key];
            } else {
                $parent_key = strtolower($key) . "s";
            }

            if (!isset($array[$parent_key])) {
                $array[$parent_key] = [];
            }

            $child = [];
            $this->mungeAttributesIntoArray($child, $childData);
            $this->mungeChildrenIntoArray($child, $childData);
            $array[$parent_key][] = (object)$child;
        }
    }

    /**
     * @param \SimpleXMLElement $element
     * @return \stdClass
     */
    private function parseResponse(\SimpleXMLElement $element): \stdClass
    {
        $response = new \stdClass();
        $response->status = (string)$element->status->attributes()['returnCode'];
        $response->affinities = new \stdClass();

        foreach ($element->Affinities->Affinity as $affinity) {
            $response->affinities->{$affinity->attributes()['affinityID']} = (string)$affinity->attributes()['affinityDesc'];
        }

        if (!isset($element->describedVehicleGroup)) {
            $response->vehicles = [];

            foreach ($element->describedVehicle as $vehicleData) {
                $vehicle = [];
                $this->mungeAttributesIntoArray($vehicle, $vehicleData);
                $this->mungeChildrenIntoArray($vehicle, $vehicleData);
                $response->vehicles[] = (object) $vehicle;
            }

        }
        else {
            $response->groups = [];
            foreach($element->describedVehicleGroup as $groupData) {
                $group = [];
                $this->mungeAttributesIntoArray($group, $groupData);
                $this->mungeChildrenIntoArray($group, $groupData, ['describedVehicle' => 'vehicles']);
                $response->groups[] = (object) $group;
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
     */
    public function get(string $vin, string $customerZip, string $dealerZip, bool $extended = false, array $searchData = [])
    {
        $data = [
            'action' => 'getDescVehicleProgramData',
            'VIN' => $vin,
            'CustomerZip' => $customerZip,
            'DealerZip' => $dealerZip,
            'extended' => ($extended ? "yes" :  "no"),
        ];

        $data = array_merge($data, $searchData);

        $response = $this->client->post("", $data);

        if ($response) {
            return $this->parseResponse($response);
        }

        return null;
    }

}

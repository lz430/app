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

    private function mungeChildrenIntoArray(&$array, \SimpleXMLElement $element) {

        foreach($element->children() as $key => $childData) {
            $parent_key = strtolower($key) . "s";
            if (!isset($array[$parent_key])) {
                $array[$parent_key] = [];
            }

            $child = [];
            $this->mungeAttributesIntoArray($child, $childData);
            $this->mungeChildrenIntoArray($child, $childData);
            $array[$parent_key][] = (object) $child;
        }
    }

    /**
     * @param \SimpleXMLElement $element
     * @return \stdClass
     */
    private function parseResponse(\SimpleXMLElement $element): \stdClass
    {
        $response = new \stdClass();
        $response->affinities = new \stdClass();
        $response->vehicles = [];

        foreach ($element->Affinities->Affinity as $affinity) {
            $response->affinities->{$affinity->attributes()['affinityID']} = (string)$affinity->attributes()['affinityDesc'];
        }

        $this->mungeAttributesIntoArray($response->vehicles, $element->describedVehicle);
        $this->mungeChildrenIntoArray($response->vehicles, $element->describedVehicle);

        return $response;
    }

    /**
     * @param string $vin
     * @param string $customerZip
     * @param string $dealerZip
     * @param array $searchData
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     */
    public function get(string $vin, string $customerZip, string $dealerZip, array $searchData = [])
    {
        $data = [
            'action' => 'getDescVehicleProgramData',
            'VIN' => $vin,
            'CustomerZip' => $customerZip,
            'DealerZip' => $dealerZip,
        ];

        $data = array_merge($data, $searchData);

        $response = $this->client->post("", $data);

        if ($response) {
            return $this->parseResponse($response);
        }

        return null;
    }

}

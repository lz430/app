<?php

namespace DeliverMyRide\DataDelivery\Service;


class TotalRateService extends BaseService
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

        $response->scenarios = [];
        foreach ($element->DealScenario as $scenarioData) {
            $scenario = [];
            $this->client->mungeAttributesIntoArray($scenario, $scenarioData);
            $this->client->mungeChildrenIntoArray($scenario, $scenarioData);
            $response->scenarios[] = (object)$scenario;
        }

        $response->residuals = [];

        foreach ($element->AisResidualData->FinanceCompany as $companyData) {
            $data = [];
            $this->client->mungeAttributesIntoArray($data, $companyData);
            $this->client->mungeChildrenIntoArray($data, $companyData);
            $response->residuals[] = (object) $data;
        }

        $response->standardRates = [];
        $this->client->mungeAttributesIntoArray($response->standardRates, $element->StandardRates);
        $this->client->mungeChildrenIntoArray($response->standardRates, $element->StandardRates);

        return $response;
    }

    /**
     * @param string $vehicleId
     * @param string $customerZip
     * @param string $dealerZip
     * @param array $searchData
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @see http://xmlasvr.aisrebates.com/ais_xml/test.html (request 2)
     *
     */
    public function get(string $vehicleId, string $customerZip, string $dealerZip, array $searchData = [])
    {
        $data = [
            'action' => 'getTotalRateData',
            'DescribedVehicleID' => $vehicleId,
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

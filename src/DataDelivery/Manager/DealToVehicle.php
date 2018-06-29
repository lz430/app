<?php

namespace DeliverMyRide\DataDelivery\Manager;

use DeliverMyRide\DataDelivery\DataDeliveryClient;

use App\Models\Deal;

use GuzzleHttp\Exception\ClientException;

/**
 *
 */
class DealToVehicle
{
    private const TRIM_MAP = [
        'BY_MODEL' => [

        ],
        'BY_TRIM' => [
            'Momentum' => 'T6 Momentum',
            '230i' => 'i xDrive',
            '330i' => 'i xDrive',
            '430i' => 'i xDrive',
            '530i' => 'i xDrive',
            'M550i' => 'i xDrive',
            '340i' => 'i xDrive',
        ],
    ];

    private const BODY_STYLE_MAP = [
        'Sport Utility Vehicle' => "Sport Utility",
        'Pickup' => 'Regular Cab'
    ];

    private $client;
    private $deal;
    private $zipcode;

    /**
     * @param Deal $deal
     * @param string $zipcode
     * @param DataDeliveryClient|null $client
     */
    public function __construct(Deal $deal, string $zipcode, DataDeliveryClient $client = null)
    {
        $this->deal = $deal;
        $this->zipcode = $zipcode;
        $this->client = $client;
    }

    /**
     * @param array $data
     * @param $attribute
     * @param $value
     * @return array
     */
    private function filterUnlessNone(array $data, $attribute, $value): array
    {
        $filtered = array_filter($data, function ($record) use ($attribute, $value) {
            if (is_array($value) && isset($record->{$attribute}) && in_array($record->{$attribute}, $value)) {
                return true;
            } else if (isset($record->{$attribute}) && $record->{$attribute} == $value) {
                return true;
            } else {
                return false;
            }
        });

        if (count($filtered)) {
            return $filtered;
        }

        return $data;
    }

    private function translateTrimName(): string
    {
        $trim = $this->deal->version->trim_name;
        $model = $this->deal->version->model->name;

        if (isset(self::TRIM_MAP['BY_MODEL'][$model])) {
            return self::TRIM_MAP['BY_MODEL'][$model];
        }

        if (isset(self::TRIM_MAP['BY_TRIM'][$trim])) {
            return self::TRIM_MAP['BY_TRIM'][$trim];
        }

        return $trim;
    }

    private function translateBodyStyle(): string
    {
        $body = $this->deal->version->body_style;

        if (isset(self::BODY_STYLE_MAP[$body])) {
            return self::BODY_STYLE_MAP[$body];
        } else {
            return $body;
        }
    }

    private function translateNumberDoors()
    {
        $doors = $this->deal->version->doors;

        if (in_array($this->deal->version->body_style, [
            'Sport Utility Vehicle'
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    /**
     * @return array
     */
    private function getSearchParams(): array
    {
        $params = [
            'year' => $this->deal->version->year,
            'model' => $this->deal->version->model->name,
            'model_code' => $this->deal->model_code,
            'option_codes' => $this->deal->option_codes,
            'package_codes' => $this->deal->package_codes,
            'trim' => $this->translateTrimName(),
            'doors' => $this->translateNumberDoors(),
            'body' => $this->translateBodyStyle(),
        ];

        return $params;
    }

    /**
     * @param $search
     * @return mixed|null
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchProgramData($search)
    {
        $results = null;
        try {
            $results = $this->client->programdata->get(
                $this->deal->vin,
                $this->zipcode,
                $this->deal->dealer->zip,
                false,
                $search
            );
        } catch (ClientException $exception) {
            //TODO: Log
        }

        return $results;
    }

    /**
     * @param array $vehicles
     * @param $params
     * @return null|string
     */
    private function narrowDownVehicles(array $vehicles, $params): ?string
    {
        $vehicles = $this->filterUnlessNone($vehicles, 'Trim', $params['trim']);
        $vehicles = $this->filterUnlessNone($vehicles, 'OptionGroup', $params['option_codes']);
        $vehicles = $this->filterUnlessNone($vehicles, 'OptionGroup', "Base");
        $vehicles = $this->filterUnlessNone($vehicles, 'Package', $params['package_codes']);

        if (count($vehicles)) {
            return end($vehicles)->DescVehicleID;
        }

        return null;
    }

    /**
     * @return mixed|null
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get()
    {
        $results = null;

        // Try easy search first
        $params = $this->getSearchParams();
        $search = [
            //'Trim' => $params['trim'],
            'ManufactModelCode' => $params['model_code'],
            'Year' => $params['year'],
            'Body' => $params['body'],
        ];

        $results = $this->fetchProgramData($search);
        // We have to narrow down the results.
        if (count($results->vehicles) > 1) {
            $vehicleId = $this->narrowDownVehicles($results->vehicles, $params);
            $search = [
                'DescVehicleID' => $vehicleId,
            ];
            $results = $this->fetchProgramData($search);
        }
        return $results;
    }

}
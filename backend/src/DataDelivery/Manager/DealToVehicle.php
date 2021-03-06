<?php

namespace DeliverMyRide\DataDelivery\Manager;

use App\Models\Deal;
use GuzzleHttp\Exception\ClientException;
use DeliverMyRide\DataDelivery\DataDeliveryClient;

class DealToVehicle
{
    private const TRANSMISSION_MAP = [
        'Automatic' => 'AT',
        'Manual' => 'MT',
    ];

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
        'Sport Utility Vehicle' => 'Sport Utility',
        'Pickup' => 'Regular Cab',
        'Minivan' => 'Passenger Van',
        'Mini Mpv' => 'Hatchback',
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
            } elseif (isset($record->{$attribute}) && $record->{$attribute} == $value) {
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
            'Sport Utility Vehicle',
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    private function translateTransmission()
    {
        $transmission = $this->deal->filters()->whereHas('category', function ($query) {
            $query->where('title', '=', 'transmission');
        })->first();

        if ($transmission) {
            return self::TRANSMISSION_MAP[$transmission->title];
        }
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
            'transmission' => $this->translateTransmission(),
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
        $vehicles = $this->filterUnlessNone($vehicles, 'OptionGroup', 'Base');
        $vehicles = $this->filterUnlessNone($vehicles, 'Package', $params['package_codes']);
        $vehicles = $this->filterUnlessNone($vehicles, 'Trans', $params['transmission']);
        if (count($vehicles)) {
            return end($vehicles)->DescVehicleID;
        }

        return null;
    }

    /**
     * @return bool|mixed|null
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get()
    {
        $results = null;

        if (! $this->deal->dealer) {
            return $results;
        }

        // Try easy search first
        $params = $this->getSearchParams();
        $search = [
            'ManufactModelCode' => $params['model_code'],
            'Year' => $params['year'],
            'Body' => $params['body'],
        ];

        $results = $this->fetchProgramData($search);
        if (! $results) {
            app('sentry')->captureMessage('Data Delivery API: Invalid XML returned', [], [
                'extra' => $params,
            ]);

            return [];
        }

        if ($results->status === '2') {
            app('sentry')->captureMessage('Data Delivery API: '.$results->error, [], [
                'extra' => $params,
            ]);

            return [];
        }
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

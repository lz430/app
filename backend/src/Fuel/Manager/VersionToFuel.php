<?php

namespace DeliverMyRide\Fuel\Manager;

use DeliverMyRide\Fuel\Map;
use App\Models\JATO\Version;
use DeliverMyRide\Fuel\FuelClient;
use GuzzleHttp\Exception\ClientException;

class VersionToFuel
{
    private $client;
    private $version;

    public function __construct(FuelClient $client = null)
    {
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
            if (isset($record->{$attribute}) && $record->{$attribute} == $value) {
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

    /**
     * Translate our model names to Fuel model names.
     * @return mixed
     */
    private function translateModelName(): string
    {
        $model = $this->version->model->name;
        if (isset(Map::MODEL_MAP[$model])) {
            return Map::MODEL_MAP[$model];
        } else {
            return $model;
        }
    }

    private function translateTrimName(): string
    {
        $trim = $this->version->trim_name;
        $model = $this->version->model->name;

        if (isset(Map::TRIM_MAP['BY_MODEL'][$model])) {
            return Map::TRIM_MAP['BY_MODEL'][$model];
        }

        if (isset(Map::TRIM_MAP['BY_TRIM'][$trim])) {
            return Map::TRIM_MAP['BY_TRIM'][$trim];
        }

        return $trim;
    }

    /**
     * @return mixed
     */
    private function translateBodyStyle(): string
    {
        $body = strtolower($this->version->body_style);

        if (isset(Map::BODY_STYLE_MAP[$body])) {
            return Map::BODY_STYLE_MAP[$body];
        } else {
            return $body;
        }
    }

    /**
     * @param $color
     * @return string
     */
    public function translateColorName($color): string
    {
        foreach (Map::COLOR_MAP as $needle => $value) {
            if (str_contains($color, $needle)) {
                return $value;
            }
        }

        return $color;
    }

    public function translateNumberDoors()
    {
        $doors = $this->version->doors;

        if (in_array($this->version->body_style, [
            'Sport Utility Vehicle',
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    /**
     * @return array
     */
    public function getSearchParams(): array
    {
        if (! $this->version) {
            return [];
        }

        $params = [
            'year' => $this->version->year,
            'make' => $this->version->model->make->name,
            'model' => $this->translateModelName(),
            'trim' => $this->translateTrimName(),
            'doors' => $this->translateNumberDoors(),
            'body' => $this->translateBodyStyle(),
        ];

        //
        // TODO: Do this better
        if ($params['year'] == '2017' && $params['make'] == 'Toyota' && $params['model'] == 'Corolla iM') {
            $params['model'] = 'Corolla';
            $params['trim'] = 'iM';
        }

        return $params;
    }

    /**
     * @param Version|null $version
     * @return null|\stdClass
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function matchFuelVehicleToVersion(Version $version = null): ?\stdClass
    {
        if ($version) {
            $this->version = $version;
        }

        $vehicles = [];

        $params = $this->getSearchParams();

        try {
            $vehicles = $this->client->vehicle->getVehicleId(
                $params['year'],
                $params['make'],
                $params['model']);
        } catch (ClientException $exception) {
            //TODO: Log
        }

        $vehicles = $this->filterUnlessNone($vehicles, 'num_doors', $params['doors']);
        $vehicles = $this->filterUnlessNone($vehicles, 'trim', $params['trim']);
        $vehicles = $this->filterUnlessNone($vehicles, 'bodytype', $params['body']);

        if (count($vehicles)) {
            return end($vehicles);
        }

        return null;
    }

    /**
     * @param Version $version
     * @param string $color
     * @param string $vehicleId
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function assets(Version $version, $color = null, $vehicleId = null): array
    {
        //
        // Type: default
        $product_id = '1';
        $product_format_id = [['1', '1']];

        //
        // Type: colorized
        if ($color) {
            $product_id = '2';
            $product_format_id = [['2'], ['3'], ['4']];
        }

        if (! $vehicleId) {
            $vehicle = $this->matchFuelVehicleToVersion($version);
            if ($vehicle) {
                $vehicleId = $vehicle->id;
            }
        }

        if (! $vehicleId) {
            return [];
        }

        $assets = [];

        if ($color) {
            $color = $this->translateColorName($color);
        } else {
            $color = '';
        }

        try {
            $media = $this->client->vehicle->vehicleMedia($vehicleId, $product_id, '', $color);
        } catch (ClientException $exception) {
            if ($exception->getCode() == '404') {
                // TODO: Log these
            }
        }

        if (! isset($media)) {
            return [];
        }

        $asset_groups = [];
        foreach ($media->products as $product) {
            foreach ($product->productFormats as $format) {
                $key = "{$product->id}--{$format->id}";
                if (count($format->assets)) {
                    $asset_groups[$key] = $format->assets;
                }
            }
        }

        foreach ($product_format_id as $group_of_ids) {
            foreach ($group_of_ids as $id) {
                $key = "{$product_id}--{$id}";
                if (isset($asset_groups[$key])) {
                    $assets = array_merge($assets, $asset_groups[$key]);
                    break;
                }
            }
        }

        return $assets;
    }
}

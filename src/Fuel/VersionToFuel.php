<?php

namespace DeliverMyRide\Fuel;

use App\Models\JATO\Version;

use GuzzleHttp\Exception\ClientException;

/**
 *
 */
class VersionToFuel
{

    private const MODEL_MAP = [
        'A3 Sedan' => 'A3',
        'A3 Cabriolet' => 'A3',
        'A5 Coupe' => 'A5',
        'A8' => 'A8 L',
        'allroad' => 'A4 allroad',
        '6 Series Gran Turismo' => '6-series',
        'M2 Coupe' => ['2-series', 'M2'],
        'ATS Sedan' => 'ATS',
        'ATS-V Sedan' => 'ATS-V',
        'CTS Sedan' => 'CTS',
        'ATS Coupe' => 'ATS',
        'CTS-V Sedan' => 'CTS-V',
        'Corvette' => 'Corvette Grandsport',
        'Express Cargo' => 'Express 2500 Cargo',
        'Wrangler JK' => 'Wrangler',
        'Wrangler JK Unlimited' => 'Wrangler Unlimited',
        'All-New Wrangler' => 'Wrangler',
        'All-New Wrangler Unlimited' => 'Wrangler Unlimited',
        'Silverado 2500HD' => 'Silverado 2500HD',
        'Ram 1500 Pickup' => '1500',
        'Ram 2500 Pickup' => '2500',
        'C-Max' => 'C-Max Hybrid',
        'Transit Van ' => 'Transit Van 150',
        'F-250 Super Duty' => 'F-250 SD',
        'F-350 Super Duty' => 'F-350 SD DRW',
        'Transit Van' => 'Transit Van 150',
        'Sierra 1500 Denali ' => 'Sierra 1500',
        'Sierra 2500 Denali HD' => 'Sierra 2500 HD',
        'Clarity' => 'Clarity Plug-In Hybrid',
        'Ioniq' => 'Ioniq Hybrid',
        'Q60 Coupe' => 'Q60',
        'All-New Compass' => 'Compass',
        'AMG GT Coupe' => 'AMG GT',
        'C-Class Coupe' => 'C-Class',
        'C-Class Sedan' => 'C-Class',
        'CLA' => 'CLA-Class',
        'E-Class' => 'E-Class',
        'SL Roadster' => 'SL-Class',
        'NV Cargo' => 'NV200 Compact Cargo',
        'NV Passenger' => 'NV 3500 Passenger',
        'Rogue Sport' => 'Rogue',
        'Versa Sedan' => 'Versa',
        '718' => '718 Boxter',
        '719' => '719 Boxter',
        'Prius Prime' => 'Prius',
        'Yaris iA' => 'Yaris iA',
        'Tiguan Limited' => 'Tiguan',
        'Golf' => 'Golf GTI',
    ];

    private const COLOR_MAP = [
        'Blue' => 'Blue',
        'Chief Clearcoat' => 'Blue',
        'Black' => 'Black',
        'White' => 'White',
        'Anvil' => 'White',
        'Champagne Pearlcoat' => 'White',
        'Ivory' => 'White',
        'Red' => 'Red',
        'Cherry' => 'Red',
        'Ruby Flare Pearl' => 'Red',
        'Velvet' => 'Red',
        'Silver' => 'Silver',
        'Billet Clearcoat' => 'Silver',
        'Billet Metallic' => 'Silver',
        'Orange' => 'Orange',
        'Purple' => 'Purple',
        'Green' => 'Green',
        'Hypergreen Clearcoat'  => 'Green',
        'Gray' => 'Gray',
        'Dark Cordovan Pearl' => 'Gray',
        'Cordovan' => 'Gray',
        'Granite' => 'Gray',
        'Grante Crys Met' => 'Gray',
        'Crystal Metallic' => 'Gray',
        'Glacier Metallic' => 'Gray',
        'Smokestone Metallic' => 'Gray',
        'Tungsten Metallic' => 'Gray',
        'Light Graystone Pearlcoat' => 'Gray',
        'Steel Metallic' => 'Gray',
        'Rhino Clearcoat' => 'Gray',
        'Yellow' => 'Yellow',
        'Brown' => 'Brown',
        'Brown Metallic' => 'Brown',
        'Gobi Clearcoat' => 'Brown',
        'Light Brownstone Pearlcoat' => 'Brown',
        'Mocha Steel Metallic' => 'Brown',
    ];

    private $client;
    private $version;

    public function __construct(Version $version, FuelClient $client)
    {
        $this->version = $version;
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
     * @param $model
     * @return mixed
     */
    private function translateModelName($model)
    {
        if (isset(self::MODEL_MAP[$model])) {
            return self::MODEL_MAP[$model];
        } else {
            return $model;
        }
    }

    private function translateColorName($color)
    {

        foreach (self::COLOR_MAP as $needle => $value) {
            if (str_contains($color, $needle)) {
                return $value;
            }
        }

        return $color;
    }

    /**
     * @return null|\stdClass
     */
    private function matchFuelVehicleToVersion(): ?\stdClass
    {
        $vehicles = [];

        $model = $this->translateModelName($this->version->model->name);
        $trim = $this->version->trim_name;

        // In some situations our model actually includes model and trim.
        if (is_array($model)) {
            list($model, $trim) = $model;
        }

        try {
            $vehicles = $this->client->vehicle->getVehicleId($this->version->year, $this->version->model->make->name, $model);
        } catch (ClientException $exception) {
            if ($exception->getCode() == '404') {
                print "CANNOT FIND FUEL VEHICLE\n";
                print_r([
                    $this->version->year,
                    $this->version->model->make->name,
                    $model
                ]);
            }
        }

        $vehicles = $this->filterUnlessNone($vehicles, 'num_doors', $this->version->doors);
        $vehicles = $this->filterUnlessNone($vehicles, 'trim', $trim);

        if (count($vehicles)) {
            return end($vehicles);
        }

        return null;
    }

    /**
     * @param string $color
     * @return array
     */
    public function assets($color = 'default'): array
    {
        $product_id = '1';
        $product_format_id = ['18'];

        if ($color != 'default') {
            $product_id = '2';
            $product_format_id = ['5', '7', '10'];
        }

        $vehicle = $this->matchFuelVehicleToVersion();


        if (!$vehicle) {
            return [];
        }

        $assets = [];

        if ($color == 'default') {
            $color = '';
        } else {
            $color = $this->translateColorName($color);
        }

        try {
            $media = $this->client->vehicle->vehicleMedia($vehicle->id, $product_id, '', $color);
        } catch (ClientException $exception) {
            if ($exception->getCode() == '404') {
                // TODO: Log these
            }
        }

        if (!isset($media)) {
            return [];
        }

        foreach ($media->products as $product) {
            if ($product->id == $product_id) {
                foreach ($product->productFormats as $format) {
                    if (in_array($format->id, $product_format_id)) {
                        $assets = $format->assets;
                    }
                }
            }
        }
        return $assets;
    }
}

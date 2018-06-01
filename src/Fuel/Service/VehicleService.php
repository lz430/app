<?php

namespace DeliverMyRide\Fuel\Service;


class VehicleService extends BaseService
{

    private const MODEL_MAP = [
        'A3 Sedan' => 'A3',
        'A3 Cabriolet' => 'A3',
        'A5 Coupe' => 'A5',
        'A8' => 'A8 L',
        'allroad' => 'A4 allroad',
        '6 Series Gran Turismo' => '6-series',
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

    private function translateModelName($model) {
        if (isset(self::MODEL_MAP[$model])) {
            return self::MODEL_MAP[$model];
        } else {
            return $model;
        }
    }

    /**
     * Get vehicle id... required to find shots.
     * @see http://fuelapi.com/support/documentation#vehicle-products
     * @param int $year
     * @param string $make
     * @param string $model
     * @param string $body
     * @param int $doors
     * @param string $drive
     * @param string $trim
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * Note: please provide 'base' for trim if you wish to request the base trim.
     *
     */
    public function getVehicleId(int $year,
                                 string $make,
                                 string $model,
                                 string $body = '',
                                 int $doors = 0,
                                 string $drive = '',
                                 string $trim = ''
    )
    {

        $query = [
            'year' => $year,
            'make' => $make,
            'model' => $this->translateModelName($model),
        ];

        if ($body) {
            $query['body'] = $body;
        }

        if ($doors) {
            $query['doors'] = $doors;
        }

        if ($drive) {
            $query['drive'] = $drive;
        }

        if ($trim) {
            if ($trim === 'base') {
                $trim = '';
            }
            $query['trim'] = $trim;
        }

        return $this->client->get("vehicles", $query);
    }

    /**
     * vehicle media
     * @see http://fuelapi.com/support/documentation#vehicle-products
     * @param int $vehicleId
     * @param string $productId
     * @param string $shotCode
     * @param string $color
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * Note: please provide 'base' for trim if you wish to request the base trim.
     *
     */
    public function vehicleMedia(int $vehicleId, string $productId = '', string $shotCode = '', string $color = '')
    {
        $query = ['proto' => 'https'];

        if ($productId) {
            $query['productID'] = $productId;
        }

        if ($shotCode) {
            $query['shotCode'] = $shotCode;
        }

        if ($color) {
            $query['color'] = $color;
        }

        return $this->client->get("vehicle/{$vehicleId}", $query);
    }

}

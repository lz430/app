<?php

namespace DeliverMyRide\Fuel\Service;


class VehicleService extends BaseService
{


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
            'model' => $model,
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
            if (strtolower($trim) === 'base') {
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
            $query['color'] = strtolower($color);
        }


        return $this->client->get("vehicle/{$vehicleId}", $query);
    }

}

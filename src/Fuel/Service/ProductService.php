<?php

namespace DeliverMyRide\Fuel\Service;


class ProductService extends BaseService {

    /**
     * VIN decoder
     * @see http://fuelapi.com/support/documentation#product-data
     * @param bool $showShotCodes
     * @param bool $showProductFormats
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     */
    public function list(bool $showShotCodes = false, bool $showProductFormats = false) {
        $query = [];

        if ($showShotCodes) {
            $query['showShotCodes'] = 1;
        }

        if ($showProductFormats) {
            $query['showProductFormats'] = 1;
        }

        return $this->client->get("products", $query);
    }

}

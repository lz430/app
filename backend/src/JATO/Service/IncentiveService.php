<?php

namespace DeliverMyRide\JATO\Service;

class IncentiveService extends BaseService
{
    /**
     * list programs.
     * @see https://www.jatoflex.com/docs/services/55afaedd74be0902ecb1914d/operations/55bfa45274be090f600d5f7c?
     * @param string $vehicleId
     * @param array $query
     *   ['zipCode' => '',
     *    'validDate' => '',
     *    'target' => ''];
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function listPrograms(string $vehicleId, array $query = [])
    {
        return $this->client->get("incentives/programs/{$vehicleId}", $query);
    }

    /**
     * list targets.
     * @see https://www.jatoflex.com/docs/services/55afaedd74be0902ecb1914d/operations/5930666a74be09177021c5d5?
     * @param string $vehicleId
     * @param array $query
     *   ['zipCode' => '',
     *    'validDate' => '',
     *    'state' => ''];
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function listTargets(string $vehicleId, array $query = [])
    {
        return $this->client->get("incentives/bestOffer/{$vehicleId}/targets", $query);
    }

    /**
     * best offer.
     * @see https://www.jatoflex.com/docs/services/55afaedd74be0902ecb1914d/operations/59306b7574be09177021c5d8?
     * @param string $vehicleId
     * @param string $paymentType
     * @param string $zipcode
     * @param string $targets
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function bestOffer(string $vehicleId, string $paymentType, string $zipcode, string $targets)
    {
        $type_blacklist = [
            7, // Cash Certificate Coupon ** Coupon **
            11, // Gift
            14, // Payment/Fee Waiver
            15, // Package Option Discount
            16, // Trade-in Allowance
            25, // Cash on % of Objective
            26, // Enhanced Rate/APR
            27, // Enhanced Rate with Cash or Fee Waiver
            28, // Other Financing
            29, // Enhanced Rate and Residual
            30, // Enhanced Rate/Money Factor
            37, // Dealer Spin
            44, // Flat Pay
            47, // Direct/Private Offer ** Coupon **
            50, // Final Pay
            52, // Aged Inventory Bonus Cash
        ];

        $query = [
            'zipCode' => $zipcode,
            'targets' => $targets,
            'excludeTypes' => implode(',', $type_blacklist),
        ];

        return $this->client->get("incentives/bestOffer/{$vehicleId}/{$paymentType}", $query);
    }
}

<?php

namespace App\Services\Quote;

use App\Models\Deal;
use App\Transformers\DealQuoteTransformer;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;
use DeliverMyRide\DataDelivery\Map;
use Illuminate\Support\Facades\Cache;

/**
 * Calculate the price for a given vehicle accurately using specific information
 * provided by the end user.
 */
class DealQuote
{
    private $dataDeliveryClient;
    private $carletonClient;
    private $deal;

    private $ratesAndRebatesData;
    private $potentialConditionalRoles;

    private $cacheLifetime = (48 * 60);

    /**
     * @param DataDeliveryClient $dataDeliveryClient
     * @param Client $client
     */
    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    /**
     * @param $paymentType
     * @param $zip
     * @param $primaryRole
     * @param array $conditionalRoles
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getRatesAndRebates($paymentType, $zip, $primaryRole, $conditionalRoles = [])
    {
        $manager = new DealRatesAndRebatesManager($this->deal, $zip, $primaryRole, $this->dataDeliveryClient);
        $manager->setFinanceStrategy($paymentType);
        $manager->setConsumerRole($primaryRole, $conditionalRoles);
        $found = $manager->searchForVehicleAndPrograms();
        if ($found) {
            $manager->setScenario();
            $this->ratesAndRebatesData = $manager->getData();
            $this->potentialConditionalRoles = $manager->getPotentialConditionals();
        }
    }

    /**
     * @param $data
     * @return array|mixed
     */
    private function getLeasePayments($data)
    {
        $manager = new DealLeasePaymentsManager($this->deal, $this->carletonClient);
        $results = $manager->get(
            $data['rates'],
            $data['rebates']['total'],
            $data['meta']['down'],
            $data['meta']['primaryRole'],
            $data['meta']['tradeValue'],
            $data['meta']['tradeOwed']
        );

        $payments = [];
        foreach ($results as $result) {
            $payments[$result['term']][$result['annual_mileage']] = [
                'monthlyUseTax' => $result['monthly_use_tax'],
                'monthlyPreTaxPayment' => $result['monthly_pre_tax_payment'],
                'monthlyPayment' => $result['monthly_payment'],
                'totalAmountAtDriveOff' => $result['total_amount_at_drive_off'],
            ];
        }
        return $payments;
    }

    /**
     * @param string $role
     * @return array
     */
    private function extractRoles(string $role): array
    {
        $roles = explode("-", $role);
        $roles = array_map(function ($role) {
            return Map::SHORT_CONDITIONS_TO_CONDITIONALS[$role];
        }, $roles);

        $primaryRole = array_intersect(Map::PRIMARY_ROLES, $roles);
        $primaryRole = reset($primaryRole);

        $conditionalRoles = array_diff($roles, Map::PRIMARY_ROLES);
        return [$primaryRole, $conditionalRoles];
    }

    /**
     * @param array $roles
     * @return string
     */
    private function buildRoleKey(array $roles): string
    {
        $short_map = array_flip(Map::SHORT_CONDITIONS_TO_CONDITIONALS);
        $shorts = array_map(function ($role) use ($short_map) {
            return $short_map[$role];
        }, $roles);

        sort($shorts);
        return implode("-", $shorts);
    }

    /**
     * @param Deal $deal
     * @param string $zip
     * @param string $paymentType
     * @param array $roles
     * @param bool $force
     * @param int $down
     * @param int $tradeValue
     * @param int $tradeOwed
     * @return array|mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(
        Deal $deal,
        string $zip,
        string $paymentType,
        array $roles,
        bool $force = false,
        $down = 0,
        $tradeValue = 0,
        $tradeOwed = 0
    )
    {
        $this->deal = $deal;

        $roleKey = $this->buildRoleKey($roles);
        list($primaryRole, $conditionalRoles) = $this->extractRoles($roleKey);

        //$key = "{$deal->id}-{$paymentType}-{$zip}--{$roleKey}";
        $key = "{$deal->id}-{$paymentType}-detroit--{$roleKey}";

        $cacheKey = md5('quote.' . $key);
        $tagKey = 'deal-' . $deal->id;
        $data = Cache::tags($tagKey)->get($cacheKey);
        if ($force || !$data) {
            $this->getRatesAndRebates($paymentType, $zip, $primaryRole, $conditionalRoles);
            $ratesAndRebates = $this->ratesAndRebatesData;
            $potentialConditionalRoles = $this->potentialConditionalRoles;
            $meta = (object)[
                'paymentType' => $paymentType,
                'zipcode' => $zip,
                'area' => 'detroit',
                'dealId' => $this->deal->id,
                'primaryRole' => $primaryRole,
                'conditionalRoles' => $conditionalRoles,
                'key' => $key,
                'error' => $ratesAndRebates === null
            ];

            //
            // This is a little iffy... We should come up with a better way to organize this.
            // We need the data from the transformation to correctly get lease payments =(

            $data = (new DealQuoteTransformer())->transform(
                $ratesAndRebates,
                $meta,
                $potentialConditionalRoles
            );

            Cache::tags($tagKey)->put($cacheKey, $data, $this->cacheLifetime);
        }

        $data['meta']['down'] = $down;
        $data['meta']['tradeValue'] = $tradeValue;
        $data['meta']['tradeOwed'] = $tradeOwed;

        if ($paymentType === "lease" && isset($data['rates'][0])) {
            $payments = $this->getLeasePayments($data);
            $data['payments'] = $payments;
        }

        return $data;
    }

}
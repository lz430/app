<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use App\Transformers\DealQuoteTransformer;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;
use DeliverMyRide\DataDelivery\Map;
use Illuminate\Support\Facades\Cache;

class DealQuoteController extends BaseAPIController
{
    private $dataDeliveryClient;
    private $carletonClient;
    private $deal;

    private $ratesAndRebatesData;
    private $potentialConditionalRoles;

    /**
     * Amount of time in minutes to store items in the cache
     * @var integer
     */
    private $cacheLifetime = (24 * 60);

    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    /**
     * @param $paymentType
     * @param $zip
     * @param $primaryRole
     * @param $conditionalRoles
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getRatesAndRebates($paymentType, $zip, $primaryRole, $conditionalRoles = [])
    {
        $manager = new DealRatesAndRebatesManager($this->deal, $zip, $primaryRole, $this->dataDeliveryClient);
        $manager->setFinanceStrategy($paymentType);
        $manager->setConsumerRole($primaryRole, $conditionalRoles);
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();
        $this->potentialConditionalRoles = $manager->getPotentialConditionals();
        $this->ratesAndRebatesData = $manager->getData();
    }

    /**
     * @param $data
     * @return array|mixed
     */
    private function getLeasePayments($data)
    {
        $manager = new DealLeasePaymentsManager($this->deal, $this->carletonClient);
        return $manager->get($data['rates'], $data['rebates']['total'], [0], $data['meta']['primaryRole']);
    }

    private function extractRoles($role)
    {
        $roles = explode("-", $role);
        $roles = array_map(function($role) {
            return Map::SHORT_CONDITIONS_TO_CONDITIONALS[$role];
        }, $roles);

        $primaryRole = array_intersect(Map::PRIMARY_ROLES, $roles);
        $primaryRole = reset($primaryRole);

        $conditionalRoles = array_diff($roles, Map::PRIMARY_ROLES);
        return [$primaryRole, $conditionalRoles];
    }

    private function buildRoleKey($roles) {
        $short_map = array_flip(Map::SHORT_CONDITIONS_TO_CONDITIONALS);
        $shorts =  array_map(function($role) use ($short_map) {
            return $short_map[$role];
        }, $roles);

        sort($shorts);
        return implode("-", $shorts);
    }

    public function quote(Deal $deal)
    {
        $this->deal = $deal;
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'roles' => 'required|array|in:default,employee,supplier,college,military,conquest,loyal',
        ]);

        $paymentType = request('payment_type');
        $zip = request('zipcode');

        $roleKey = $this->buildRoleKey(request('roles'));
        list($primaryRole, $conditionalRoles) = $this->extractRoles($roleKey);

        //30-cash-48220-default
        $key = "{$deal->id}-{$paymentType}-{$zip}--{$roleKey}";

        $cacheKey = md5('quote.' . $key);
        if (false && $data = Cache::tags('quote')->get($cacheKey)) {
            return $data;
        }

        $this->getRatesAndRebates($paymentType, $zip, $primaryRole, $conditionalRoles);

        $ratesAndRebates = $this->ratesAndRebatesData;
        $potentialConditionalRoles = $this->potentialConditionalRoles;

        $meta = (object)[
            'paymentType' => $paymentType,
            'zipcode' => $zip,
            'dealId' => $this->deal->id,
            'primaryRole' => $primaryRole,
            'conditionalRoles' => $conditionalRoles,
            'key' => $key,
        ];

        //
        // This is a little iffy... We should come up with a better way to organize this.
        // We need the data from the transformation to correctly get lease payments =(
        $data = (new DealQuoteTransformer())->transform(
            $ratesAndRebates,
            $meta,
            $potentialConditionalRoles
        );

        if ($paymentType === "lease" && isset($data['rates'][0])) {
            $payments = $this->getLeasePayments($data);
            $data['payments'] = $payments;
        }

        Cache::tags('quote')->put($cacheKey, $data, $this->cacheLifetime);
        return $data;
    }

}

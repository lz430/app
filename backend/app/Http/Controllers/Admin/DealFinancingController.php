<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use App\Transformers\DealQuoteTransformer;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;

class DealFinancingController extends Controller
{
    private const ZIPCODE = '48116';
    private $deal;
    private $dataDeliveryClient;
    private $carletonClient;

    /**
     * @param $paymentType
     * @param $zip
     * @param $role
     * @return \stdClass
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getRatesAndRebates($paymentType, $role) {
        $manager = new DealRatesAndRebatesManager($this->deal, self::ZIPCODE, $role, $this->dataDeliveryClient);
        $manager->setFinanceStrategy($paymentType);
        $manager->setConsumerRole($role);
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();
        return $manager->getData();
    }

    /**
     * @param $data
     * @param $role
     * @return array|mixed
     */
    private function getLeasePayments($data, $role) {
        $manager = new DealLeasePaymentsManager($this->deal, $this->carletonClient);
        return $manager->get($data['rates'], $data['rebates']['total'], [0], $role);
    }

    public function show(Deal $deal, DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        $this->deal = $deal;
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;

        $data = [
            'deal' => $deal,
            'quotes' => [],
        ];


        $paymentTypes = [
            'cash', 'finance', 'lease',
        ];

        $roles = [
            'default', 'employee', 'supplier',
        ];

        foreach($paymentTypes as $type) {
            foreach($roles as $role) {
                $meta = (object) [
                    'paymentType' => $type,
                    'zipcode' => self::ZIPCODE,
                    'dealId' => $this->deal->id,
                    'role' => $role,
                ];

                $element = [];
                $element['rates'] = $this->getRatesAndRebates($type, $role);
                $element['quote'] = (new DealQuoteTransformer())->transform($element['rates'], $meta);
                if ($type === "lease" && isset($element['quote']['rates'][0])) {
                    $element['payments'] = $this->getLeasePayments($element['quote'], $role);
                }
                $data['quotes'][$type][$role] = $element;
            }
        }

        return view('admin.deal-financing',
            $data
        );
    }
}

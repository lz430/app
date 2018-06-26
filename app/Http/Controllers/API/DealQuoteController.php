<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use App\Transformers\DealQuoteTransformer;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;

class DealQuoteController extends BaseAPIController
{
    const CACHE_LENGTH = 1440;

    private $dataDeliveryClient;
    private $carletonClient;
    private $deal;

    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    /**
     * @param $paymentType
     * @param $zip
     * @return \stdClass
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getRatesAndRebates($paymentType, $zip) {
        $manager = new DealRatesAndRebatesManager($this->deal, $zip, $this->dataDeliveryClient);
        $manager->setFinanceStrategy($paymentType);
        $manager->setConsumerRole('default');
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();
        return $manager->getData();
    }

    /**
     * @param $data
     * @return array|mixed
     */
    private function getLeasePayments($data) {
        $manager = new DealLeasePaymentsManager($this->deal, $this->carletonClient);

        return $manager->get($data['rates'], $data['rebates']['total']);
    }

    public function quote(Deal $deal)
    {
        $this->deal = $deal;
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
        ]);

        $paymentType = request('payment_type');
        $zip = request('zipcode');

        $ratesAndRebates = $this->getRatesAndRebates($paymentType, $zip);

        $meta = (object) [
            'paymentType' => $paymentType,
            'zipcode' => $zip,
            'dealId' => $this->deal->id,
        ];

        //
        // This is a little iffy... We should come up with a better way to organize this.
        // We need the data from the transformation to correctly get lease payments =(
        $data = (new DealQuoteTransformer())->transform($ratesAndRebates, $meta);

        if ($paymentType === "lease" && isset($data['rates'][0])) {
            $payments = $this->getLeasePayments($data);
            $data['payments'] = $payments;
        }

        return $data;
    }

}

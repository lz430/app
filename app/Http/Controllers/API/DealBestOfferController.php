<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use App\Transformers\BestOfferTransformer;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

class DealBestOfferController extends BaseAPIController
{
    const CACHE_LENGTH = 1440;

    public $client;

    public function __construct(DataDeliveryClient $client)
    {
        $this->client = $client;
    }

    public function getBestOffer(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
        ]);

        $manager = new DealRatesAndRebatesManager($deal, request('zipcode'), $this->client);
        $manager->setFinanceStrategy('lease');
        $manager->setConsumerRole('default');
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();

        $data = $manager->getData();
        $paymentType = request('payment_type');

        return (new BestOfferTransformer)->transform(['results' => $data, 'paymentType' => $paymentType]);
    }

}

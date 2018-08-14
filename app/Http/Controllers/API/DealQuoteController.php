<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use DeliverMyRide\DataDelivery\DataDeliveryClient;

use DeliverMyRide\Carleton\Client;

use App\Services\Quote\DealQuote;

class DealQuoteController extends BaseAPIController
{
    private $dataDeliveryClient;
    private $carletonClient;

    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    public function quote(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'roles' => 'required|array|in:default,employee,supplier,college,military,conquest,loyal,responder,gmcompetitive,gmlease,cadillaclease,gmloyalty',
        ]);

        return (new DealQuote($this->dataDeliveryClient, $this->carletonClient))
            ->get(
                $deal,
                request('zipcode'),
                request('payment_type'),
                request('roles'),
                request('force')
            );
    }

}

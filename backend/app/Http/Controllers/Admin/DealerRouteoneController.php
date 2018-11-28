<?php

namespace App\Http\Controllers\Admin;

use App\Models\Dealer;
use App\Http\Controllers\Controller;

class DealerRouteoneController extends Controller
{
    /**
     * @param Dealer $dealer
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(Dealer $dealer)
    {

        /* @var \App\Models\Deal */
        $deal = $dealer->deals()->first();

        if ($deal && $dealer->route_one_id) {
            $pricing = $deal->prices();
            $query = [
                'rteOneDmsId' => config('services.routeone.id'),
                'dealerId' => $dealer->route_one_id,
                'buyOrLease' => 1,
                'email' => 'mattwisner1+fake@gmail.com',
                'vehicle_vin' => $deal->vin,
                'vehicleYear' => $deal->year,
                'vehicleMake' => $deal->version->model->make->name,
                'vehicleModel' => $deal->version->model->name,
                'contractTerms_vehiclestyle' => $deal->version->style(),
                'contractTerms_msrp' => $pricing->msrp,
                'contractTerms_cash_down' => 500,
                'contractTerms_financed_amount' => $pricing->default - 500,
                'contractTerms_term' => 36,
                'vehicle_image_url' => $deal->featuredPhoto(),
                'dealership_name' => $deal->dealer->name,
            ];

            $url = config('services.routeone.production_url').'?'.http_build_query($query);
        } else {
            $url = null;
        }

        return view('admin.dealer-routeone',
            [
                'dealer' => $dealer,
                'url' => $url,
            ]
        );
    }
}

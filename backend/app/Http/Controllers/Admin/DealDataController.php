<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Manager\BuildEquipmentData;

class DealDataController extends Controller
{
    private $version;
    private $deal;

    private function buildFilters()
    {
        $features = [];
        foreach ($this->deal->features as $feature) {
            if (! isset($features[$feature->category->title])) {
                $features[$feature->category->title] = [];
            }
            $features[$feature->category->title][] = $feature;
        }

        $groups = [
            [
                'Vehicle Size' => isset($features['Size']) ? $features['Size'] : [],
                'Drive Train' => isset($features['Drive Train']) ? $features['Drive Train'] : [],
                'Transmission' => isset($features['Transmission']) ? $features['Transmission'] : [],
                'Fuel Type' => isset($features['Fuel Type']) ? $features['Fuel Type'] : [],
            ],
            [
                'Seating' => isset($features['Seating']) ? $features['Seating'] : [],
                'Seat Materials' => isset($features['Seat Materials']) ? $features['Seat Materials'] : [],
                'Interior' => isset($features['Interior']) ? $features['Interior'] : [],
                'Safety & Driver Assist' => isset($features['Safety & Driver Assist']) ? $features['Safety & Driver Assist'] : [],
            ],
            [
                'Infotainment' => isset($features['Infotainment']) ? $features['Infotainment'] : [],
                'Comfort & Convenience' => isset($features['Comfort & Convenience']) ? $features['Comfort & Convenience'] : [],
            ],
        ];

        return $groups;
    }

    /**
     * @param Deal $deal
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(Deal $deal)

    {
        $this->deal = $deal;
        $this->version = $deal->version;

        $debug_models = [];
        $debug_deal = $deal->toArray();
        unset($debug_deal['features']);
        unset($debug_deal['version']);

        $debug_models[] = [
            'title' => 'Deal',
            'model' => $debug_deal,
        ];

        $debug_models[] = [
            'title' => 'Version',
            'model' => $this->version->toArray(),
        ];

        $equipment = (new BuildEquipmentData())->build($deal->getEquipment(), $deal, false, true);

        $equipment = collect($equipment)->groupBy('category');
        $data = [
            'deal' => $deal,
            'equipment' => $equipment,
            'filters' => $this->buildFilters(),
            'models' => $debug_models,
        ];

        return view('admin.deal-data',
            $data
        );
    }
}

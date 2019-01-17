<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Manager\BuildOverviewData;
use DeliverMyRide\JATO\Manager\BuildEquipmentData;

class DealDataController extends Controller
{
    private $version;
    private $deal;

    private function buildFilters()
    {
        $filters = [];
        foreach ($this->deal->filters()->with('category')->get() as $filter) {
            if (! isset($filters[$filter->category->title])) {
                $filters[$filter->category->title] = [];
            }
            $filters[$filter->category->title][] = $filter;
        }

        $groups = [
            [
                'Vehicle Size' => isset($filters['Size']) ? $filters['Size'] : [],
                'Drive Train' => isset($filters['Drive Train']) ? $filters['Drive Train'] : [],
                'Transmission' => isset($filters['Transmission']) ? $filters['Transmission'] : [],
                'Fuel Type' => isset($filters['Fuel Type']) ? $filters['Fuel Type'] : [],
            ],
            [
                'Seating' => isset($filters['Seating']) ? $filters['Seating'] : [],
                'Seat Materials' => isset($filters['Seat Materials']) ? $filters['Seat Materials'] : [],
                'Interior' => isset($filters['Interior']) ? $filters['Interior'] : [],
                'Safety & Driver Assist' => isset($filters['Safety & Driver Assist']) ? $filters['Safety & Driver Assist'] : [],
            ],
            [
                'Infotainment' => isset($filters['Infotainment']) ? $filters['Infotainment'] : [],
                'Comfort & Convenience' => isset($filters['Comfort & Convenience']) ? $filters['Comfort & Convenience'] : [],
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

        $equipmentOnDeal = $deal->getEquipment();
        $equipment = (new BuildEquipmentData())->build($equipmentOnDeal, $deal, false, true);
        $equipment = collect($equipment)->groupBy('category');
        $data = [
            'deal' => $deal,
            'equipment' => $equipment,
            'filters' => $this->buildFilters(),
            'models' => $debug_models,
            'packages' => [],
            'options' => [],
            'highlights' => [],
            'overview' => [],
        ];

        if ($deal->option_codes != null) {
            foreach ($this->version->options()->where('option_type', 'O')->whereIn('option_code', $deal->option_codes)->get() as $option) {
                $data['options'][] = [
                    'option_name' => $option->option_name,
                    'option_code' => $option->option_code,
                    'msrp' => $option->msrp,
                    'invoice_price' => $option->invoice_price,
                ];
            }
        }

        if ($deal->package_codes != null) {
            foreach ($this->version->options()->where('option_type', 'P')->whereIn('option_code', $deal->package_codes)->get() as $package) {
                $data['packages'][] = [
                    'option_name' => $package->option_name,
                    'option_code' => $package->option_code,
                    'msrp' => $package->msrp,
                    'invoice_price' => $package->invoice_price,
                ];
            }
        }

        $dealDetailData = new BuildOverviewData();
        $data['overview'] = $dealDetailData->getOverviewData($equipmentOnDeal, $deal);
        $data['highlights'] = $dealDetailData->getHighlightsData($equipmentOnDeal, $deal);

        return view('admin.deal-data',
            $data
        );
    }
}

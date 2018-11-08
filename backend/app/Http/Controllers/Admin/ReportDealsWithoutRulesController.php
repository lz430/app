<?php

namespace App\Http\Controllers\Admin;

use DB;
use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Dealer;


class ReportDealsWithoutRulesController extends Controller
{
    public function index()
    {
        $dealers = Dealer::all();
        $data = [];
        foreach ($dealers as $dealer) {
            if ($dealer->price_rules) {
                $fields = collect($dealer->price_rules)->pluck('base_field')->all();
            } else {
                $fields = [];
            }

            $fields = array_unique(array_filter($fields));
            if (!count($fields)) {
                continue;
            }
            $item = [
                'fields' => $fields,
                'dealer' => $dealer,
                'deals' => [],
                'stats' => [],
            ];
            if (count($fields)) {
                $query = Deal::where('dealer_id', '=', $dealer->dealer_id)->where('status', '=', 'available');

                $query->where(function($query) use ($fields){
                    foreach ($fields as $field) {
                        $query = $query->whereRaw("not JSON_CONTAINS(JSON_KEYS(source_price), JSON_ARRAY(?))", [$field], 'or');
                    }
                });

                $item['deals'] = $query->get();

                $item['stats']['missing'] = $query->count();
                $item['stats']['active'] = Deal::where('dealer_id', '=', $dealer->dealer_id)->where('status', '=', 'available')->count();

            }
            if (!count($item['deals'])) {
                continue;
            }
            $data[] = $item;
        }

        return view('admin.reports.deals-without-rules', ['data' => $data]);
    }
}

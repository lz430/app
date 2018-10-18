<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dealer;

class ReportDealerPriceRulesController extends Controller
{
    public function index()
    {
        $dealers = Dealer::select('dealer_id', 'name', 'price_rules')->whereNotNull('price_rules')->orderBy('name', 'asc')->get();
        return view('admin.reports.dealer-price-rules', ['dealers' => $dealers]);
    }

    public function export()
    {
        $csv = \League\Csv\Writer::createFromFileObject(new \SplTempFileObject());
        $csv->insertOne(['Dealer ID', 'Name', 'Scenario', 'Base Field', 'Value', 'Modifier', 'VIN', 'Make', 'Model']);

        $dealer = Dealer::select('dealer_id', 'name', 'price_rules')->get();
        $data = [];
        foreach($dealer as $rule) {
            $data['dealer_id'] = $rule->dealer_id;
            $data['name'] = $rule->name;
            foreach($rule->price_rules as $key => $price) {
                $data['Scenario'] = $key;
                $data['Base Field'] = $price->base_field;
                foreach($price->rules as $p){
                    $data['Value'] = $p->value;
                    $data['Modifier'] = $p->modifier;
                    $data['VIN'] = $p->conditions->vin;
                    $data['Make'] = $p->conditions->make;
                    $data['Model'] = $p->conditions->model;
                    $csv->insertOne($data);
                }
                //$csv->insertOne($data);
            }

        }

        $csv->output('dealer-price-rules.csv');
    }
}
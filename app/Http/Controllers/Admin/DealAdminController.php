<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;

class DealAdminController extends Controller
{
    private $client;
    private $version;
    private $deal;
    private $equipment;


    private function potentialVersionOptions()
    {
        try {
            return $this->client->option->get($this->version->jato_vehicle_id, 'O')->options;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function potentialVersionPackages()
    {
        try {
            return $this->client->option->get($this->version->jato_vehicle_id, 'P')->options;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function potentialVersionEquipment() {

        try {
            return $this->client->equipment->get($this->version->jato_vehicle_id)->results;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function buildStandardEquipment() {
        return $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })->all();
    }

    private function buildEquipmentForOptionCode($code) {
        return $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== "optional";
            })
            ->reject(function ($equipment) use ($code) {
                return $equipment->optionCode != $code;
            })->all();
    }

    private function buildPackages() {
        return collect($this->potentialVersionPackages())
            ->map(function ($option) {
                return [
                    'isOnDeal' => in_array($option->optionCode, $this->deal->package_codes),
                    'option' => $option,
                    'equipment' => $this->buildEquipmentForOptionCode($option->optionCode)
                ];
            })->all();
    }

    private function buildOptions() {
        return collect($this->potentialVersionOptions())
            ->map(function ($option)  {
                return [
                    'isOnDeal' => in_array($option->optionCode, $this->deal->option_codes),
                    'option' => $option,
                    'equipment' => $this->buildEquipmentForOptionCode($option->optionCode)
                ];
            })->all();
    }

    private function buildFeatures() {
        $features = [];
        foreach ($this->deal->features as $feature) {
            if (!isset($features[$feature->category->title])) {
                $features[$feature->category->title] = [];
            }

            $features[$feature->category->title][] = $feature;
        }

        $groups = [
            [
                'Vehicle Size' => isset($features['Vehicle Size']) ? $features['Vehicle Size'] : [],
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
            ]
        ];

        return $groups;
    }

    public function show(Deal $deal, JatoClient $client)
    {
        $this->client = $client;
        $this->deal = $deal;
        $this->version = $deal->version;
        $this->equipment = collect($this->potentialVersionEquipment());

        $data = [
            'deal' => $deal,
            'standardEquipment' => $this->buildStandardEquipment(),
            'options' => $this->buildOptions(),
            'packages' => $this->buildPackages(),
            'features' => $this->buildFeatures(),
        ];

        return view('admin.deal-view',
            $data
        );
    }
}

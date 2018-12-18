<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use App\Http\Controllers\Controller;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use DeliverMyRide\JATO\Manager\DealCompareData;

class DealJatoDataController extends Controller
{
    /* @var JatoClient */
    private $client;
    private $version;
    private $deal;

    /* @var \Illuminate\Support\Collection */
    private $equipment;

    private function potentialVersionOptions()
    {
        try {
            return $this->client->option->get($this->version->jato_vehicle_id, 'O')->options;
        } catch (ServerException | ClientException $e) {
            return [];
        }
    }

    private function potentialVersionPackages()
    {
        try {
            return $this->client->option->get($this->version->jato_vehicle_id, 'P')->options;
        } catch (ServerException | ClientException $e) {
            return [];
        }
    }

    private function potentialVersionEquipment()
    {
        try {
            return $this->client->equipment->get($this->version->jato_vehicle_id)->results;
        } catch (ServerException | ClientException $e) {
            return [];
        }
    }

    private function potentialJatoVersionsForVin()
    {
        try {
            return $this->client->vin->decode($this->deal->vin);
        } catch (ServerException | ClientException $e) {
            return [];
        }
    }

    private function buildJatoVersionOptions()
    {
        $versions = $this->potentialJatoVersionsForVin();

        if (! $versions) {
            return [];
        }

        $data = [];
        $data['versions'] = $versions->versions;

        unset($versions->links);
        unset($versions->versions);

        $data['decode'] = $versions;

        return $data;
    }

    private function buildStandardEquipment()
    {
        return $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })
            ->groupBy('category')
            ->all();
    }

    private function buildEquipmentForOptionCode($code)
    {
        return $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'optional';
            })
            ->reject(function ($equipment) use ($code) {
                return $equipment->optionCode != $code;
            })->all();
    }

    private function buildPackages()
    {
        return collect($this->potentialVersionPackages())
            ->map(function ($option) {
                return [
                    'isOnDeal' => is_array($this->deal->package_codes) && in_array($option->optionCode, $this->deal->package_codes),
                    'option' => $option,
                    'equipment' => $this->buildEquipmentForOptionCode($option->optionCode),
                ];
            })->all();
    }

    private function buildOptions()
    {
        return collect($this->potentialVersionOptions())
            ->map(function ($option) {
                return [
                    'isOnDeal' => is_array($this->deal->option_codes) && in_array($option->optionCode, $this->deal->option_codes),
                    'option' => $option,
                    'equipment' => $this->buildEquipmentForOptionCode($option->optionCode),
                ];
            })->all();
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
            'versions' => $this->buildJatoVersionOptions(),
            'packages' => $this->buildPackages(),
        ];

        return view('admin.deal-jato-data',
            $data
        );
    }
}

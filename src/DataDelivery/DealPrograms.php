<?php

namespace DeliverMyRide\DataDelivery;

use App\Models\Deal;

use GuzzleHttp\Exception\ClientException;

/**
 *
 */
class DealPrograms
{
    private const TRIM_MAP = [
        'BY_MODEL' => [

        ],
        'BY_TRIM' => [

        ],
    ];
    private const BODY_STYLE_MAP = [
        'Sport Utility Vehicle' => "Sport Utility",
    ];

    private $client;
    private $deal;
    private $zipcode;
    private $isLease;

    private $vehicleId;
    private $programs;
    private $leaseProgram;
    private $scenario;

    private $scenarios;
    private $residuals;
    private $standardRates;
    private $financeCompany;
    private $miles;


    /**
     * DealPrograms constructor.
     * @param Deal $deal
     * @param string $zipcode
     * @param bool $isLease
     * @param DataDeliveryClient|null $client
     */
    public function __construct(Deal $deal, string $zipcode, $isLease, DataDeliveryClient $client = null)
    {
        $this->deal = $deal;
        $this->zipcode = $zipcode;
        $this->isLease = $isLease;
        $this->client = $client;
    }

    /**
     * @param array $data
     * @param $attribute
     * @param $value
     * @return array
     */
    private function filterUnlessNone(array $data, $attribute, $value): array
    {

        $filtered = array_filter($data, function ($record) use ($attribute, $value) {
            if (is_array($value) && isset($record->{$attribute}) && in_array($record->{$attribute}, $value)) {
                return true;
            } else if (isset($record->{$attribute}) && $record->{$attribute} == $value) {
                return true;
            } else {
                return false;
            }
        });

        if (count($filtered)) {
            return $filtered;
        }

        return $data;
    }

    private function translateTrimName(): string
    {
        $trim = $this->deal->version->trim_name;
        $model = $this->deal->version->model->name;

        if (isset(self::TRIM_MAP['BY_MODEL'][$model])) {
            return self::TRIM_MAP['BY_MODEL'][$model];
        }

        if (isset(self::TRIM_MAP['BY_TRIM'][$trim])) {
            return self::TRIM_MAP['BY_TRIM'][$trim];
        }

        return $trim;
    }

    private function translateBodyStyle(): string
    {
        $body = $this->deal->version->body_style;

        if (isset(self::BODY_STYLE_MAP[$body])) {
            return self::BODY_STYLE_MAP[$body];
        } else {
            return $body;
        }
    }

    private function translateNumberDoors()
    {
        $doors = $this->deal->version->doors;

        if (in_array($this->deal->version->body_style, [
            'Sport Utility Vehicle'
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    /**
     * @return array
     */
    private function getSearchParams(): array
    {
        $params = [
            'year' => $this->deal->version->year,
            'model_code' => $this->deal->model_code,
            'option_codes' => $this->deal->option_codes,
            'package_codes' => $this->deal->package_codes,
            'trim' => $this->translateTrimName(),
            'doors' => $this->translateNumberDoors(),
            'body' => $this->translateBodyStyle(),
        ];

        return $params;
    }

    /**
     * @param $response
     * @return array
     */
    private function extractProgramData($response)
    {
        $programs = [];

        if (!isset($response->vehicles[0]->programs)) {
            return $programs;
        }

        foreach ($response->vehicles[0]->programs as $program) {
            if (in_array($program->ProgramType, ["Text Only", 'IVC/DVC'])) {
                continue;
            }
            $data = $program;

            $mungedScenarios = [];
            foreach ($data->dealscenarios as $key => $scenario) {
                if (isset($scenario->tiers)) {
                    $scenario = (object)array_merge((array)$scenario, (array)$scenario->tiers[0]);
                    unset($scenario->tiers);
                }

                if (isset($scenario->terms)) {
                    foreach ($scenario->terms as &$term) {
                        if (isset($term->tiers)) {
                            $term = (object)array_merge((array)$term, (array)$term->tiers[0]);
                            unset($term->tiers);
                        }
                    }
                }
                $mungedScenarios[$scenario->DealScenarioType] = $scenario;
            }
            $data->dealscenarios = $mungedScenarios;
            $programs[] = $data;
        }

        $this->programs = collect($programs);
    }

    /**
     * @param array $vehicles
     * @param $params
     * @return null|string
     */
    private function narrowDownVehicles(array $vehicles, $params): ?string
    {
        $vehicles = $this->filterUnlessNone($vehicles, 'OptionGroup', $params['option_codes']);
        $vehicles = $this->filterUnlessNone($vehicles, 'OptionGroup', "Base");
        $vehicles = $this->filterUnlessNone($vehicles, 'Package', $params['package_codes']);

        if (count($vehicles)) {
            return end($vehicles)->DescVehicleID;
        }

        return null;
    }

    /**
     * @param $search
     * @return mixed|null
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchProgramData($search)
    {
        $results = null;
        try {
            $results = $this->client->programdata->get(
                $this->deal->vin,
                $this->zipcode,
                $this->deal->dealer->zip,
                false,
                $search
            );
        } catch (ClientException $exception) {
            //TODO: Log
        }

        return $results;
    }

    private function cashPrograms()
    {
        return $this->programs
            ->reject(function ($program) {
                return $program->TotalCashFlag != "yes";
            });
    }

    private function allLeasePrograms()
    {
        return $this->programs
            ->reject(function ($program) {
                return $program->ProgramType != "Lease";
            });
    }

    private function leaseProgramsWithScenario($type)
    {
        return $this->allLeasePrograms()
            ->reject(function ($program) use ($type) {
                return (!isset($program->dealscenarios[$type]));
            });
    }

    /**
     * Priority:
     *
     * Manufacturer - Lease Special
     * Affiliate - Lease Special
     * Manufacturer - Lease Standard
     * Affiliate - Lease Standard
     */
    private function bestLeaseProgram()
    {
        $selectedProgram = null;
        $selectedType = null;

        foreach ([
                     'Manufacturer - Lease Special',
                     'Affiliate - Lease Special',
                     'Manufacturer - Lease Standard',
                     'Affiliate - Lease Standard'] as $type) {

            $programs = $this->leaseProgramsWithScenario($type);

            if (!$programs->count()) {
                continue;
            } elseif ($programs->count() == 1) {
                $selectedProgram = $programs->first();
                $selectedType = $type;
                break;
            } else {
                // TODO: Compare programs.
                $selectedProgram = $programs->first();
                $selectedType = $type;
                break;
            }
        }

        $this->leaseProgram = $selectedProgram;
        $this->scenario = $selectedType;
    }

    private function totalCashValue()
    {
        $scenario = $this->scenarios
            ->reject(function ($scenario) {
                return $scenario->DealScenarioType != $this->scenario;
            })
            ->first();

        return collect($scenario->tiers[0]->aprprograms[0]->programs)
            ->reject(function ($program) {
                return !isset($program->Cash);
            })
            ->map(function ($program) {
                return $program->Cash;
            })
            ->sum();
    }

    private function programIds()
    {
        $programIds = [];

        $cashProgramIds = $this->cashPrograms()
            ->reject(function ($program) {
                return !isset($program->dealscenarios[$this->scenario]);
            })
            ->pluck('ProgramID')->all();

        $programIds = array_merge($cashProgramIds, $programIds);

        if ($this->leaseProgram) {
            $programIds[] = $this->leaseProgram->ProgramID;
        }

        return $programIds;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getPrograms()
    {
        $results = null;

        // Try easy search first
        $params = $this->getSearchParams();

        $search = [
            'Trim' => $params['trim'],
            'ManufactModelCode' => $params['model_code'],
            'Year' => $params['year'],
            'Body' => $params['body'],
        ];

        $results = $this->fetchProgramData($search);

        // We have to narrow down the results.
        if (count($results->vehicles) > 1) {
            $vehicleId = $this->narrowDownVehicles($results->vehicles, $params);
            $search = [
                'DescVehicleID' => $vehicleId,
            ];
            $results = $this->fetchProgramData($search);
        }

        $this->extractProgramData($results);
        $this->vehicleId = $results->vehicles[0]->DescVehicleID;
    }


    private function bestFinanceCompany()
    {
        $companies = $this->residuals
            ->filter()
            ->reject(function ($company) {

                $scenarios = collect($company->dealscenarios)
                    ->reject(function ($scenario) {
                        return $scenario->DealScenarioType != $this->scenario;
                    })
                    ->reject(function ($scenario) {
                        return !isset($scenario->residualmasters) && !isset($scenario->programs);
                    })->count();

                return !$scenarios;
            });

        //
        // TODO: improve selection logic
        $this->financeCompany = $companies->first();
    }

    private function getMileage()
    {

        $scenario = collect($this->financeCompany->dealscenarios)
            ->reject(function ($scenario) {
                return $scenario->DealScenarioType != $this->scenario;
            })
            ->reject(function ($scenario) {
                return !isset($scenario->residualmasters) && !isset($scenario->programs);
            })
            ->first();

        $miles = null;
        if (isset($scenario->programs)) {
            $miles = $scenario->programs[0]->mileages;
        } else if (isset($scenario->mileages)) {
            $miles = $scenario->mileages;
        }

        $this->miles = $miles;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getTotals()
    {

        //
        // Then we pick the program ids.
        $programIds = $this->programIds();

        //
        // Next we do some other shit...
        print_r($this->vehicleId);
        $totalRateResponse = $this->client->totalrate->get(
            $this->vehicleId,
            $this->zipcode,
            $this->deal->dealer->zip,
            ['ProgramIDs' => implode(",", $programIds)]
        );


        //print_r($totalRateResponse->residuals);
        $this->scenarios = collect($totalRateResponse->scenarios);
        $this->residuals = collect($totalRateResponse->residuals);
        $this->standardRates = collect($totalRateResponse->standardRates);

        // TODO: Remove invalid cash offers.
    }

    /**
     *
     */
    private function pack()
    {
        $response = new \stdClass();
        $response->isLease = $this->isLease;

        $response->cash = (object) [
          'total' => $this->totalCashValue(),
        ];

        if ($response->isLease) {
            //
            // Build Miles
            $response->leaseMiles = [];
            foreach ($this->miles as $group) {
                $mileGroup = [];
                foreach ($group->terms as $term) {
                    $mileGroup[$term->TermLength] = $term->Residual;
                }
                $response->leaseMiles[$group->Miles] = $mileGroup;
            }

            //
            // Build Lease Program
            $program = $this->leaseProgram;
            $terms = $program->dealscenarios[$this->scenario]->terms;
            unset($program->dealscenarios);
            $response->leaseProgram = $program;

            $terms = collect($terms)
                ->reject(function ($term) {
                    return $term->Factor == "STD";
                })->all();

            $response->leaseTerms = $terms;
        }

        return $response;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getData()
    {
        //
        // First we get all the programs.
        $this->getPrograms();

        //
        // Then we pick a scenario and a specific lease program.
        if ($this->isLease) {
            $this->bestLeaseProgram();
        } else {
            $this->scenario = 'Cash - Bank APR';
        }

        //
        // Get totals
        $this->getTotals();
        $this->bestFinanceCompany();
        $this->getMileage();
        $res = $this->pack();
        return $res;
    }

}

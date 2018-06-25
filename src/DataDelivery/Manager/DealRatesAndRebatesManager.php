<?php

namespace DeliverMyRide\DataDelivery\Manager;

use App\Models\Deal;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use GuzzleHttp\Exception\ClientException;

/**
 *
 */
class DealRatesAndRebatesManager
{
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
     * @param Deal $deal
     * @param string $zipcode
     * @param DataDeliveryClient|null $client
     */
    public function __construct(Deal $deal, string $zipcode, DataDeliveryClient $client = null)
    {
        $this->deal = $deal;
        $this->zipcode = $zipcode;
        $this->client = $client;
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
            $programs[$data->ProgramID] = $data;
        }

        $this->programs = collect($programs);
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
     *
     * We select the best lease program and the scenario at the same time.
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

        $scenarios = [
            'Manufacturer - Lease Special',
            'Affiliate - Lease Special',
            'Manufacturer - Lease Standard',
            'Affiliate - Lease Standard'
        ];

        foreach ($scenarios as $type) {

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

    /**
     * Cash value for applied programs
     * @return mixed
     */
    private function totalCashValue()
    {
        $scenario = $this->scenarios
            ->reject(function ($scenario) {
                return $scenario->DealScenarioType != $this->scenario;
            })
            ->first();

        if (!isset($scenario->tiers)) {
            return 0;
        }

        return collect($scenario->tiers[0]->aprprograms[0]->programs)
            ->reject(function ($program) {
                return !isset($program->Cash);
            })
            ->map(function ($program) {
                return $program->Cash;
            })
            ->sum();
    }

    /**
     * Cash value for applied programs
     * @return mixed
     */
    private function appliedCashPrograms()
    {

        $scenario = $this->scenarios
            ->reject(function ($scenario) {
                return $scenario->DealScenarioType != $this->scenario;
            })
            ->first();


        if (isset($scenario->tiers)) {
            $ids = collect($scenario->tiers[0]->aprprograms[0]->programs)
                ->reject(function ($program) {
                    return !isset($program->Cash);
                })
                ->map(function ($program) {
                    return $program->ProgramID;
                })->all();
        } else {
            $ids = [];
        }


        return $this->programs
            ->reject(function ($program) use ($ids) {
                return !in_array($program->ProgramID, $ids);
            })
            ->map(function ($program) {
                $scenario = $program->dealscenarios[$this->scenario];

                $program = clone $program;
                unset($program->dealscenarios);

                $data = [
                    'value' => $scenario->Cash,
                    'scenario' => $scenario,
                    'program' => $program,
                ];

                return (object)$data;

            })
            ->all();
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
        $company = $companies->first();

        if (!$company && $this->standardRates->count()) {
            $company = $this->standardRates->first();
        }

        $this->financeCompany = $company;
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
        //

        if (count($programIds)) {
            $data = ['ProgramIDs' => implode(",", $programIds)];
        } else {
            $data = ['ResidualsOnly' => 'yes'];
        }

        $totalRateResponse = $this->client->totalrate->get(
            $this->vehicleId,
            $this->zipcode,
            $this->deal->dealer->zip,
            $data
        );

        $this->scenarios = collect($totalRateResponse->scenarios);
        $this->residuals = collect($totalRateResponse->residuals);
        $this->standardRates = collect($totalRateResponse->standardRates);
    }

    /**
     *
     */
    private function pack()
    {
        $response = new \stdClass();
        $response->isLease = $this->isLease;

        // Everybody Rebates
        $response->cashRebates = (object)[
            'totalValue' => $this->totalCashValue(),
            'programs' => $this->appliedCashPrograms()
        ];

        if ($response->isLease) {
            //
            // Build Miles
            $response->leaseMiles = [];
            if ($this->miles) {
                foreach ($this->miles as $group) {
                    $mileGroup = [];
                    foreach ($group->terms as $term) {
                        $mileGroup[$term->TermLength] = $term->Residual;
                    }
                    $response->leaseMiles[$group->Miles] = $mileGroup;
                }
            }

            //
            // Build Lease Program
            $program = $this->leaseProgram;
            if ($program) {
                $terms = $program->dealscenarios[$this->scenario]->terms;
                unset($program->dealscenarios);
                $response->leaseProgram = $program;

                $terms = collect($terms)
                    ->reject(function ($term) {
                        return isset($term->Factor) && $term->Factor == "STD";
                    })->all();

                $response->leaseTerms = $terms;
            } else {
                $response->leaseProgram = null;
                $response->leaseTerms = [];
            }

        }

        return $response;
    }

    /**
     * @param $strategy
     *
     * strategy should be either lease/finance/cash
     */
    public function setFinanceStrategy($strategy)
    {
        if ($strategy === 'lease') {
            $this->isLease = true;
        } else {
            $this->isLease = false;
        }
    }

    /**
     * @param $role
     *
     * role should be either default/employee/supplier
     */
    public function setConsumerRole($role)
    {

    }

    /**
     * @param null $scenario
     * TODO: Support Lease + passed in scenario.
     */
    public function setScenario($scenario = null)
    {
        if (!$scenario) {
            if ($this->isLease) {
                $this->bestLeaseProgram();
            } else {
                $this->scenario = 'Cash - Bank APR';
            }
        }
    }

    /**
     * We need to find one specific vehicle that matches our deal and then using
     * that vehicle find all the valid programs and information associated it.
     *
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function searchForVehicleAndPrograms(): bool
    {
        $results = (new DealToVehicle($this->deal, $this->zipcode, $this->client))->get();

        if (!$results || !isset($results->vehicles[0]->DescVehicleID)) {
            return false;
        }
        $this->extractProgramData($results);
        $this->vehicleId = $results->vehicles[0]->DescVehicleID;

        return true;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getData()
    {

        //
        // Get totals
        $this->getTotals();
        $this->bestFinanceCompany();
        $this->getMileage();
        $res = $this->pack();
        return $res;
    }

}

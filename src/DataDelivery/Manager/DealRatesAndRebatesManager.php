<?php

namespace DeliverMyRide\DataDelivery\Manager;

use App\Models\Deal;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Map;

/**
 *
 */
class DealRatesAndRebatesManager
{
    private $client;
    private $deal;
    private $zipcode;
    private $isLease;
    private $role;
    private $conditionalRoles;

    private $vehicleId;
    private $programs;
    private $leaseProgram;
    private $scenario;

    private $scenarios;
    private $residuals;
    private $standardRates;
    private $financeCompany;
    private $miles;
    private $selectedPrograms;

    /**
     * @param Deal $deal
     * @param string $zipcode
     * @param string $role
     * @param DataDeliveryClient|null $client
     */
    public function __construct(Deal $deal, string $zipcode, string $role, DataDeliveryClient $client = null)
    {
        $this->deal = $deal;
        $this->zipcode = $zipcode;
        $this->client = $client;
        $this->role = $role;
    }

    /**
     * @param $response
     */
    private function extractProgramData($response)
    {
        $programs = [];

        if (!isset($response->vehicles[0]->programs)) {
            $this->programs = collect($programs);
        }

        foreach ($response->vehicles[0]->programs as $program) {

            if (!isset($program->ProgramType) || in_array($program->ProgramType, ["Text Only", 'IVC/DVC'])) {
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

    /**
     * @return mixed
     */
    private function cashPrivatePrograms()
    {
        return $this->programs
            ->reject(function ($program) {
                return $program->TotalCashFlag != "no";
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
     * Programs are categorized into three groups, everyone, conditional and lease.
     */
    private function findSelectedPrograms()
    {
        $programs = [];

        //
        // Everyone Programs
        $programs['everyone'] = $this->cashPrograms()
            ->reject(function ($program) {
                return !isset($program->dealscenarios[$this->scenario]);
            })
            ->all();

        //
        // Lease programs (sometimes they have CCR values)
        if ($this->leaseProgram) {
            $programs['lease'] = [
                $this->leaseProgram->ProgramID => $this->leaseProgram
            ];
        }

        //
        // Conditional programs based on roles.
        if ($this->conditionalRoles && count($this->conditionalRoles)) {
            $programs['conditional'] = $this->cashPrivatePrograms()
                ->reject(function ($program) {
                    return !isset($program->dealscenarios[$this->scenario]);
                })
                // Decorate with roles.
                ->map(function ($program) {
                    $program->role = null;
                    foreach ($this->conditionalRoles as $role) {
                        $strings = Map::CONDITIONALS_TO_PROGRAM_NAME[$role];
                        if (str_contains(strtolower($program->ProgramDescription), $strings)) {
                            $program->role = $role;
                        }
                    }

                    return $program;
                })
                ->reject(function ($program) {
                    return $program->role === null;
                })
                ->all();
        }

        $this->selectedPrograms = $programs;
    }

    /**
     * Validate selected programs, removing ones that aren't valid.
     */
    private function validateSelectedPrograms()
    {
        //
        // Find our specific scenario
        $scenario = $this->scenarios
            ->reject(function ($scenario) {
                return $scenario->DealScenarioType != $this->scenario;
            })
            ->first();

        //
        // Using the total endpoint, we can determine which programs we should actually apply.
        if (isset($scenario->tiers[0]->aprprograms)) {

            $ids = collect($scenario->tiers[0]->aprprograms[0]->programs)
                ->reject(function ($program) {
                    return !isset($program->Cash);
                })
                ->map(function ($program) {
                    return $program->ProgramID;
                })
                ->all();

        } elseif (isset($scenario->tiers[0]->programs)) {

            $ids = collect($scenario->tiers[0]->programs)
                ->reject(function ($program) {
                    return !isset($program->Cash);
                })
                ->map(function ($program) {
                    return $program->ProgramID;
                })
                ->all();

        } else {
            $ids = [];
        }

        $applied = $this->selectedPrograms;
        foreach ($applied as $category => $programs) {
            $applied[$category] = collect($programs)
                ->reject(function ($program) use ($ids, $category) {
                    return $category != 'lease' && !in_array($program->ProgramID, $ids);
                })
                ->all();
        }

        $this->selectedPrograms = $applied;
    }

    /**
     * Transform the selected programs
     */
    private function transformSelectedPrograms() {
        $applied = $this->selectedPrograms;
        foreach ($applied as $category => $programs) {
            $applied[$category] = collect($programs)
                ->map(function ($program) {
                    $scenario = $program->dealscenarios[$this->scenario];

                    $program = clone $program;
                    unset($program->dealscenarios);
                    $value = 0;

                    if (isset($scenario->Cash)) {
                        $value = $scenario->Cash;
                    } elseif (isset($scenario->terms->CCR)) {
                        $value = $scenario->terms->CCR;
                    }

                    $data = [
                        'value' => (float) $value,
                        'scenario' => $scenario,
                        'program' => $program,
                    ];

                    if (isset($program->role)) {
                        $data['role'] = $program->role;
                    }

                    return (object)$data;

                })
                ->all();
        }
        $this->selectedPrograms = $applied;
    }

    private function programIds()
    {
        $ids = [];
        foreach ($this->selectedPrograms as $category => $programs) {
            $ids = array_merge($ids, array_keys($programs));
        }
        return $ids;
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

        if (!isset($this->financeCompany->dealscenarios)) {
            return null;
        }

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

        if ($miles) {
            $miles = collect($miles)
                ->reject(function ($mile) {
                    return $mile->Miles < 7500;
                })
                ->all();
        }

        $this->miles = $miles;
    }

    /**
     * using a map of roles to affinity ids, get the affinity ids for this request.
     *
     * TODO: Validate ids exist in the response of the first call.
     * @return null
     */
    private function getAffinityID()
    {
        if (isset(Map::AFFINITY_MAP[$this->role][$this->deal->version->model->make->name])) {
            return Map::AFFINITY_MAP[$this->role][$this->deal->version->model->make->name];
        }
        return null;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getTotals()
    {
        $programIds = $this->programIds();

        if (count($programIds)) {
            $data = [
                'ProgramIDs' => implode(",", $programIds),
            ];

            $affinityId = $this->getAffinityID();
            if ($affinityId) {
                $data['AffinityIDs'] = $affinityId;
            }

        } else {
            $data = ['ResidualsOnly' => 'yes'];
        }

        // Pass in affinity data here
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

        //
        // Rebates
        $selected = $this->selectedPrograms;
        $total = 0;
        foreach($selected as $category => $programs) {
            $categoryTotal = 0;
            foreach($programs as $program){
                $categoryTotal += $program->value;
            }
            $selected[$category] = [
                'total' => $categoryTotal,
                'programs' => $programs,
            ];

            $total += $categoryTotal;
        }
        $response->rebates = $selected;
        $response->rebates['total'] = $total;

        if ($response->isLease) {
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
     * @param array $conditionalRoles
     */
    public function setConsumerRole($role, $conditionalRoles = [])
    {
        $this->role = $role;
        $this->conditionalRoles = $conditionalRoles;
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
     * Search for potential conditional roles we can expose to the user.
     */
    public function getPotentialConditionals()
    {
        return $this->cashPrivatePrograms()
            ->reject(function ($program) {
                return !isset($program->dealscenarios[$this->scenario]);
            })
            ->map(function ($program) {
                $data = null;
                foreach (Map::CONDITIONALS_TO_PROGRAM_NAME as $role => $strings) {
                    if (str_contains(strtolower($program->ProgramDescription), $strings)) {
                        $value = $program->dealscenarios[$this->scenario]->Cash;
                        $data = [
                            'id' =>  $program->ProgramID,
                            'role' =>  $role,
                            'description' => $program->ProgramContent,
                            'startDate' =>  $program->ProgramStartDate,
                            'stopDate' =>  $program->ProgramStopDate,
                            'value' => (float) $value,
                        ];
                    }
                }
                return $data;
            })
            ->unique()
            ->filter()
            ->all();
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
        $this->findSelectedPrograms();
        $this->getTotals();
        $this->validateSelectedPrograms();
        $this->transformSelectedPrograms();

        $this->bestFinanceCompany();
        $this->getMileage();

        return $this->pack();
    }

}

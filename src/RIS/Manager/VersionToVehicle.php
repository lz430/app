<?php

namespace DeliverMyRide\RIS\Manager;

use App\Models\JATO\Version;
use DeliverMyRide\RIS\RISClient;
use GuzzleHttp\Exception\ClientException;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 *
 */
class VersionToVehicle
{
    private const REGIONS = [
        'detroit' => '48116',
    ];

    private const TRANSMISSION_MAP = [
        'Automatic' => 'AT',
        'Manual' => 'MT',
    ];

    private const MODEL_MAP = [
        'BY_MODEL' => [
            // Rams
            'Ram 1500 Pickup' => '1500',

            // Caddys
            'ATS Sedan' => 'ATS',
            'ATS Coupe' => 'ATS',
            'CTS Sedan' => 'CTS',
            'CTS-V Sedan' => 'CTS-V',
            'CTS-V Coupe' => 'CTS-V',

            // Benz (Really trims)
            'C300' => 'C 300',
            'E300' => 'E 300',
            'E400' => 'E 400',
            'GLA250' => 'GLA 250',
            'CLA250' => 'CLA 250',
            'GLC300' => 'GLC 300',
            'GLE350' => 'GLE 350',
            'AMG® GLE43' => 'AMG GLE 43',
            'GLS450' => 'GLS 450',
            'GLS550' => 'GLS 550',
            'AMG® GLS63' => 'AMG GLS 63',
        ],

        'BY_MODEL_AND_TRIM' => [
            '2 Series' => [
                '230i' => '230',
                'M240i' => 'M240',
            ],
            '3 Series' => [
                '320i' => '320',
                '328d' => '328d',
                '330i' => '330',
                '330e' => '330e',
                '340i' => '340',
            ],
            '4 Series' => [
                '430i' => '430',
                '440i' => '440',
            ],
            '5 Series' => [
                '530e' => '530e',
                '540e' => '540e',
                '530i' => '530',
                '540i' => '540',
                'M550i' => 'M550',
            ],
            '6 Series Gran Turismo' => [
                '640i' => '640',
            ],
            '7 Series' => [
                '740i' => '740',
                '750i' => '750',
            ],
        ],
        'BY_MODEL_AND_TRIM_AND_NAME' => [
            'MDX' => [
                'Advance Package' => [
                    'Sport Hybrid SH-AWD w/Advance Package' => 'MDX Sport Hybrid'
                ],
            ],
            'S90' => [
                'Inscription' => [
                    'T8 Inscription PHEV AWD' => 'S90 Hybrid',
                ],
            ],
        ],
    ];

    // lol.
    private const MAKES_USE_TRIM_FOR_MODEL = [
        'Mercedes-Benz',
    ];


    /**
     *
     */
    private const TRIM_MAP = [
        'Acura' => [
            'MDX' => [
                'Base' => '3.5L',
                'Technology Package' => '3.5L w/Technology Pkg',
                'Technology & Entertainment Package' => '3.5L w/Technology & Entertainment Pkgs',
                'Advance and Entertainment Package' => '3.5L w/Advance & Entertainment Pkgs',
                'Advance Package' => [
                    'Sport Hybrid SH-AWD w/Advance Package' => '3.0L w/Advance Package',
                    'SH-AWD w/Advance Package' => '3.5L w/Advance Package',
                ],
            ],
        ],
        'Hyundai' => [
            'Elantra GT' => [
                'GT' => 'Base',
                'GT Sport' => 'Sport',
            ],
        ],
        'BY_TRIM' => [
            // BMW
            '230i' => '230',
            '330i' => 'i330',
            '430i' => '430',
            '530i' => '530',
            'M550i' => 'M550',
            '340i' => '340',

            // RAM
            'Big Horn' => 'Big Horn/Lone Star',

            // Volvo
            'T6 AWD Momentum' => 'T6 Momentum',
            'T5 AWD Momentum' => 'T5 Momentum',
            'T6 Momentum AWD' => 'T6 Momentum',
            'T5 Momentum AWD' => 'T5 Momentum',
            'T6 Inscription AWD' => 'T6 Inscription',
            'T5 AWD Inscription' => 'T5 Inscription',
            'T8 Inscription PHEV AWD' => 'T8 Inscription',
            'T8 Twin Engine Plug-in Inscription' => 'T8 Inscription',
            'T6 AWD Inscription' => 'T6 Inscription',
            'T5 Inscription AWD' => 'T5 Inscription',
            'T6 R-Design AWD' => 'T6 R-Design',
            'T5 R-Design AWD' => 'T5 R-Design',
            'T6 AWD R-Design' => 'T6 R-Design',
            'T5 AWD' => 'T5',
            'T6 AWD' => 'T6',
        ],
    ];

    private const BODY_STYLE_MAP = [
        'Sport Utility Vehicle' => "Sport Utility",
        'Pickup' => 'Regular Cab',
        'Minivan' => 'Passenger Van',
    ];

    private const CAB_MAP = [
        'Crew' => "crew cab",
    ];


    /* @var RISClient */
    private $client;

    /* @var Version */
    private $version;


    /* @var \Illuminate\Support\Collection */
    private $makes;

    /* @var \Illuminate\Support\Collection */
    private $vehicles;


    private $selected = [
        'cash' => null,
        'finance' => null,
        'lease' => null,
    ];

    /**
     * @param RISClient $client
     */
    public function __construct(RISClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param array $data
     * @param $parentAttribute
     * @param $attribute
     * @param $value
     * @return array
     */
    private function filterUnlessNone(array $data, string $parentAttribute, string $attribute, array $value): array
    {
        $recordsWith = array_filter($data, function ($record) use ($parentAttribute, $attribute, $value) {
            if (isset($record->{$parentAttribute}->{$attribute}) && count(array_intersect($record->{$parentAttribute}->{$attribute}, $value))) {
                return true;
            }

            return false;

        });

        $recordsIgnored = array_filter($data, function ($record) use ($parentAttribute, $attribute, $value) {
            if (!isset($record->{$parentAttribute}->{$attribute})) {
                return true;
            }

            return false;

        });

        if (count($recordsWith)) {
            return array_merge($recordsIgnored, $recordsWith);
        }

        return $data;
    }

    /**
     * @param \stdClass $object
     * @param string $attr
     * @param string $key
     */
    private function reKeyObjectAttribute(\stdClass $object, string $attr, string $key)
    {
        foreach ($object as $a => $v) {
            if ($a == $attr && is_array($v)) {
                $data = [];
                foreach ($v as $item) {
                    $data[$item->{$key}] = $item;
                }
                $object->{$a} = $data;
            }
        }
    }

    /**
     * @param array $arr
     * @param $search
     * @return mixed|null
     */
    private function getClosetNumber(array $arr, $search)
    {
        $closest = null;
        foreach ($arr as $item) {
            if ($closest === null || abs($search - $closest) > abs($item - $search)) {
                $closest = $item;
            }
        }
        return $closest;
    }

    private function translateTrimName(): array
    {
        $trims = [
            $this->version->trim_name,
            $this->version->name,
        ];

        $model = $this->version->model->name;
        $make = $this->version->model->make->name;
        $name = $this->version->name;
        foreach ($trims as &$trim) {

            //
            // Make
            if (isset(self::TRIM_MAP[$make]) && is_array(self::TRIM_MAP[$make])) {

                //
                // Model
                $data = self::TRIM_MAP[$make];
                if (isset($data[$model]) && is_array($data[$model])) {
                    $data = $data[$model];

                    //
                    // Trim
                    if (isset($data[$trim]) && is_array($data[$trim])) {
                        $data = $data[$trim];

                        //
                        // Name
                        if (isset($data[$name])) {
                            $trim = $data[$name];
                        }

                    } elseif (isset($data[$trim])) {
                        $trim = $data[$trim];
                    }

                } elseif (isset($data[$model])) {
                    $trim = $data[$model];
                }

            } elseif (isset(self::TRIM_MAP[$make])) {
                $trim = self::TRIM_MAP[$make];
            }

            if (isset(self::TRIM_MAP['BY_TRIM'][$trim])) {
                $trim = self::TRIM_MAP['BY_TRIM'][$trim];
            }
        }

        return $trims;
    }

    private function translateModel(): string
    {

        //
        // TODO: Refactor this
        if (in_array($this->version->model->make->name, self::MAKES_USE_TRIM_FOR_MODEL)) {
            $model = $this->version->trim_name;
        } else {
            $model = $this->version->model->name;
        }

        //
        // Just Model
        if (isset(self::MODEL_MAP['BY_MODEL'][$model])) {
            return self::MODEL_MAP['BY_MODEL'][$model];

            //
            // Model and trim
        } elseif (isset(self::MODEL_MAP['BY_MODEL_AND_TRIM'][$model][$this->version->trim_name])) {
            return self::MODEL_MAP['BY_MODEL_AND_TRIM'][$model][$this->version->trim_name];

            //
            // Model and trim and name
        } elseif (isset(self::MODEL_MAP['BY_MODEL_AND_TRIM_AND_NAME'][$model][$this->version->trim_name][$this->version->name])) {
            return self::MODEL_MAP['BY_MODEL_AND_TRIM_AND_NAME'][$model][$this->version->trim_name][$this->version->name];

        } else {
            return $model;
        }

    }

    private function translateBodyStyle(): string
    {
        $body = $this->version->body_style;

        if (isset(self::BODY_STYLE_MAP[$body])) {
            return self::BODY_STYLE_MAP[$body];
        } else {
            return $body;
        }
    }

    private function translateCab(): string
    {
        $value = $this->version->cab;
        if (isset(self::CAB_MAP[$value])) {
            return self::CAB_MAP[$value];
        } else {
            return $value;
        }
    }

    private function translateNumberDoors()
    {
        $doors = $this->version->doors;

        if (in_array($this->version->body_style, [
            'Sport Utility Vehicle'
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    private function translateTransmission()
    {
        $transmission = $this->version->transmission_type;

        if ($transmission) {
            return self::TRANSMISSION_MAP[$transmission];
        }

        return null;
    }

    /**
     * @return array
     */
    private function getSearchParams(): array
    {
        $params = [
            'year' => $this->version->year,
            'model' => $this->translateModel(),
            'model_code' => [$this->version->manufacturer_code],
            'trim' => $this->translateTrimName(),
            'doors' => $this->translateNumberDoors(),
            'body' => $this->translateBodyStyle(),
            'driven_wheels' => $this->version->driven_wheels,
            'cab' => $this->version->cab ? $this->translateCab() : null,
            'transmission' => $this->translateTransmission(),

        ];

        $codes = explode("-", str_replace(['/'], '-', $this->version->manufacturer_code));
        $codes = array_map('trim', $codes);
        $codes = array_filter($codes);
        $params['model_code'] = array_merge($params['model_code'], $codes);
        $params['model_code'] = array_unique($params['model_code']);
        return $params;
    }

    /**
     * @param bool $force
     * @return array|Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function fetchMakeHashcodes($force = false)
    {
        if (!$force && $data = Cache::tags('ris')->get('ris-makes')) {
            $this->makes = collect($data);
            return collect($data);
        }

        try {
            $response = $this->client->hashcode->makes();
            $results = [];
            foreach ($response->response as $make) {
                $results[strtolower($make->makeName)] = $make;
            }
        } catch (ClientException $exception) {
            $results = [];
        }

        Cache::tags('ris')->put('ris-makes', $results, 1440);

        if ($results) {
            $results = collect($results);
        }

        $this->makes = $results;
        return $results;
    }

    /**
     *
     */
    private function fetchVehicles()
    {
        $results = Cache::remember('ris-make-' . $this->version->model->make->name . self::REGIONS['detroit'], 240, function () {
            try {
                $results = $this->client->vehicle->findByMakeAndPostalcode(
                    $this->version->model->make->name,
                    self::REGIONS['detroit']
                );
            } catch (ClientException $exception) {
                $results = [];
            }

            return $results;
        });
        if ($results) {
            $results = collect($results->response);
        }
        $this->vehicles = $results;
    }

    private function parseHints(string $hints): \stdClass
    {
        $results = [];

        $hints = str_replace(['{', '}'], '', $hints);
        $hints = explode(",", $hints);
        foreach ($hints as $hint) {
            $hint = explode(":", $hint);
            if (count($hint) !== 2) {
                continue;
            }

            if (!isset($results[$hint[0]])) {
                $results[$hint[0]] = [];
            }

            $results[$hint[0]][] = strtolower($hint[1]);


        }

        return (object)$results;
    }

    private function parseVehicles(Collection $vehicles)
    {
        return $vehicles
            ->map(function ($vehicle) {
                $data = new \stdClass();
                $data->filters = $this->parseHints($vehicle->vehicleHints);
                if (isset($vehicle->modelYear)) {
                    $data->filters->YEAR = [
                        $vehicle->modelYear
                    ];
                }
                $data->exclude = $this->parseHints($vehicle->vehicleHintsForExclusion);
                $data->vehicle = $vehicle;
                return $data;
            });
    }

    private function reduceVehicles(Collection $vehicles)
    {
        $params = $this->getSearchParams();
        $params = array_map(function ($item) {
            if (is_array($item)) {
                $item = array_map('strtolower', $item);
            } else {
                $item = strtolower($item);
            }
            return $item;
        }, $params);


        $vehicles = $vehicles->toArray();


        // Require
        $vehicles = array_filter($vehicles, function ($vehicle) use ($params) {
            if (!isset($vehicle->filters->YEAR)) {
                return true;
            }
            return in_array($params['year'], $vehicle->filters->YEAR);
        });


        $vehicles = array_filter($vehicles, function ($vehicle) use ($params) {
            return in_array($params['model'], $vehicle->filters->MODEL);
        });

        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL_CODE', $params['model_code']);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'PACKAGE_CODE', $params['model_code']);

        /*
        foreach($vehicles as $vehicle) {
            print_r($vehicle->filters);
        }
        dd($params);
        */

        // Optional
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'PACKAGE_CODE', $params['trim']);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'TRIM', $params['trim']);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL', $params['trim']);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'DRIVE_TYPE_CODE', [$params['driven_wheels']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'BODY_TYPE', [$params['cab']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'BODY_TYPE', [$params['body']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'TRAN_TYPE', [$params['transmission']]);

        return collect($vehicles)->map(function ($item) {
            return $item->vehicle;
        });
    }

    private function selectVehicles()
    {
        foreach ($this->vehicles as $vehicle) {
            foreach ($vehicle->cashDealScenarios as $scenario) {
                if ($scenario->dealScenarioTypeName == 'Cash - Bank APR') {
                    $this->selected['cash'] = $vehicle;
                    $this->selected['finance'] = $vehicle;
                    break;
                } elseif ($scenario->dealScenarioTypeName == 'Bank Lease') {
                    $this->selected['lease'] = $vehicle;
                    break;
                }
            }
        }

    }

    public function transformSelectedVehicles()
    {
        foreach ($this->selected as $strategy => $vehicle) {
            if (!$vehicle) {
                continue;
            }

            $data = new \stdClass();
            $data->meta = new \stdClass();
            $data->scenarios = [];

            //
            // Build Meta
            foreach (
                [
                    'aisVehicleGroupID',
                    'vehicleGroupID',
                    'hashcode',
                    'modelYear',
                    'marketingYear',
                    'vehicleGroupName',
                    'regionID',
                    'vehicleHints',
                    'vehicleHintsForExclusion',
                ] as $attr) {
                if (isset($vehicle->{$attr})) {
                    $data->meta->{$attr} = $vehicle->{$attr};
                }
            }

            // Build Scenarios
            foreach (
                [
                    'cashDealScenarios',
                    'programDealScenarios',
                ] as $group) {

                if (isset($vehicle->{$group})) {
                    foreach ($vehicle->{$group} as $scenario) {
                        $data->scenarios[$scenario->dealScenarioTypeName] = $scenario;
                    }
                }
            }

            // Rekey efforts
            foreach ($data->scenarios as $name => $scenario) {
                if (isset($scenario->programs)) {
                    foreach ($scenario->programs as $program) {
                        if (isset($program->tiers)) {
                            foreach ($program->tiers as $tier) {
                                $this->reKeyObjectAttribute($tier, 'aprTerms', 'length');
                                $this->reKeyObjectAttribute($tier, 'leaseTerms', 'length');
                            }
                        }

                        if (isset($program->residuals)) {
                            $this->reKeyObjectAttribute($program, 'residuals', 'miles');
                            foreach ($program->residuals as $residual) {
                                foreach ($residual->vehicles as $vehicle) {
                                    $this->reKeyObjectAttribute($vehicle, 'termValues', 'termLength');
                                }
                            }
                        }
                    }
                }
            }

            $this->selected[$strategy] = $data;
        }


    }

    public function reduceResiduals()
    {
        if (!$this->selected['lease']) {
            return;
        }

        $data = $this->selected['lease'];

        foreach ($data->scenarios as $name => $scenario) {
            if (isset($scenario->programs)) {
                foreach ($scenario->programs as $program) {
                    if (isset($program->residuals)) {
                        foreach ($program->residuals as $residual) {
                            $vehicles = $this->parseVehicles(collect($residual->vehicles));
                            $vehicles = $this->reduceVehicles($vehicles);
                            unset($residual->vehicles);
                            $residual->termValues = $vehicles->last()->termValues;
                        }
                    }
                }
            }
        }
    }

    private function selectRates()
    {
        foreach ($this->selected as $strategy => $vehicle) {
            if (!$vehicle) {
                continue;
            }

            $data = new \stdClass();
            $data->hashcode = $vehicle->meta->hashcode;
            $data->makeHashcode = $this->makes[strtolower($this->version->model->make->name)]->hashcode;
            $data->residual = null;
            $data->miles = null;
            $data->rateType = null;

            switch ($strategy) {
                case 'cash':
                    $data->rate = 0;
                    $data->term = 0;
                    if (isset($vehicle->scenarios['Cash - Bank APR'])) {
                        $data->rebate = $vehicle->scenarios['Cash - Bank APR']->consumerCash->totalConsumerCash;
                    } else {
                        $data->rebate = 0;
                    }
                    break;

                //
                // TODO: include special financing rates?
                case 'finance':
                    $data->rate = 4;
                    $data->term = 60;

                    if (isset($vehicle->scenarios['Cash - Bank APR'])) {
                        $data->rebate = $vehicle->scenarios['Cash - Bank APR']->consumerCash->totalConsumerCash;
                    } else {
                        $data->rebate = 0;
                    }
                    break;
                case 'lease':
                    $scenario = null;

                    if (isset($vehicle->scenarios['Manufacturer - Lease Special']) && isset($vehicle->scenarios['Manufacturer - Lease Special']->programs[0])) {
                        $scenario = $vehicle->scenarios['Manufacturer - Lease Special'];
                    } elseif (isset($vehicle->scenarios['Affiliate - Lease Special']) && isset($vehicle->scenarios['Affiliate - Lease Special']->programs[0])) {
                        $scenario = $vehicle->scenarios['Affiliate - Lease Special'];
                    }


                    if ($scenario) {
                        if (count($scenario->programs)) {
                            $program = end($scenario->programs);

                            if (isset($program->consumerCash)) {
                                $data->rebate = $program->consumerCash->totalConsumerCash;
                            } else {
                                $data->rebate = 0;
                            }

                            $data->rateType = $program->rateType;
                            $data->term = $this->getClosetNumber(array_keys($program->tiers[0]->leaseTerms), 36);
                            $data->rate = $program->tiers[0]->leaseTerms[$data->term]->adjRate;

                            if (isset($program->tiers[0]->leaseTerms[$data->term]->ccrCash)) {
                                $data->rebate += $program->tiers[0]->leaseTerms[$data->term]->ccrCash->totalCCR;
                            }

                            $data->miles = $this->getClosetNumber(array_keys($program->residuals), 10000);

                            if (isset($program->residuals[$data->miles]->termValues[$data->term])) {
                                $data->residual = $program->residuals[$data->miles]->termValues[$data->term]->percentage;
                            } else {
                                $data->rate = 0;
                                $data->term = 0;
                                $data->rebate = 0;
                                $data->residual = null;
                                $data->miles = null;
                                $data->rateType = null;
                            }
                        } else {
                            $data->rate = 0;
                            $data->term = 0;
                            $data->rebate = 0;
                            $data->residual = null;
                            $data->miles = null;
                            $data->rateType = null;
                        }


                    } else {
                        $data->rate = 0;
                        $data->term = 0;
                        $data->rebate = 0;
                    }
                    break;
            }
            $data->data = $vehicle;
            $this->selected[$strategy] = $data;
        }
    }

    /**
     * @param Version $version
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(Version $version)
    {
        $this->version = $version;

        $results = null;
        $this->fetchMakeHashcodes();
        $this->fetchVehicles();
        $this->vehicles = $this->parseVehicles($this->vehicles);
        $this->vehicles = $this->reduceVehicles($this->vehicles);
        $this->selectVehicles();
        $this->transformSelectedVehicles();
        $this->reduceResiduals();
        $this->selectRates();
        return $this->selected;
    }

}
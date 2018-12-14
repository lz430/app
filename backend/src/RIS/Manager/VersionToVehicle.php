<?php

namespace DeliverMyRide\RIS\Manager;

use DeliverMyRide\RIS\Map;
use App\Models\JATO\Version;
use DeliverMyRide\RIS\RISClient;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Exception\ClientException;

class VersionToVehicle
{
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
            if (! isset($record->{$parentAttribute}->{$attribute})) {
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
     * <Make> -> <Model> -> <Trim> -> <Name>.
     * @return array
     */
    private function translateTrimName(): array
    {
        $trims = [
            $this->version->trim_name,
            $this->version->name,
        ];

        $make = $this->version->model->make->name;
        $model = $this->version->model->name;
        $name = $this->version->name;
        foreach ($trims as &$trim) {
            if (isset(Map::TRIM_MAP[$make][$model][$trim][$name]) && ! is_array(Map::TRIM_MAP[$make][$model][$trim][$name])) {
                $trim = Map::TRIM_MAP[$make][$model][$trim][$name];
            } elseif (isset(Map::TRIM_MAP[$make][$model][$trim]) && ! is_array(Map::TRIM_MAP[$make][$model][$trim])) {
                $trim = Map::TRIM_MAP[$make][$model][$trim];
            } elseif (isset(Map::TRIM_MAP[$make][$model]) && ! is_array(Map::TRIM_MAP[$make][$model])) {
                $trim = Map::TRIM_MAP[$make][$model];
            } elseif (isset(Map::TRIM_MAP[$make]) && ! is_array(Map::TRIM_MAP[$make])) {
                $trim = Map::TRIM_MAP[$make];
            }

            // Legacy Mapping Strategy
            if (isset(Map::TRIM_MAP['BY_TRIM'][$trim])) {
                $trim = Map::TRIM_MAP['BY_TRIM'][$trim];
            }
        }

        return $trims;
    }

    private function translateModel(): string
    {
        //
        // TODO: Refactor this
        if (in_array($this->version->model->make->name, Map::MAKES_USE_TRIM_FOR_MODEL)) {
            $model = $this->version->trim_name;
        } else {
            $model = $this->version->model->name;
        }

        //
        // Just Model
        if (isset(Map::MODEL_MAP['BY_MODEL'][$model])) {
            return Map::MODEL_MAP['BY_MODEL'][$model];

        //
            // Model and trim
        } elseif (isset(Map::MODEL_MAP['BY_MODEL_AND_TRIM'][$model][$this->version->trim_name])) {
            return Map::MODEL_MAP['BY_MODEL_AND_TRIM'][$model][$this->version->trim_name];

        //
            // Model and trim and name
        } elseif (isset(Map::MODEL_MAP['BY_MODEL_AND_TRIM_AND_NAME'][$model][$this->version->trim_name][$this->version->name])) {
            return Map::MODEL_MAP['BY_MODEL_AND_TRIM_AND_NAME'][$model][$this->version->trim_name][$this->version->name];
        } else {
            return $model;
        }
    }

    private function translateBodyStyle(): string
    {
        $body = $this->version->body_style;
        $model = $this->version->model->name;

        if (isset(Map::BODY_STYLE_MAP['BY_BODYSTYLE'][$body])) {
            return Map::BODY_STYLE_MAP['BY_BODYSTYLE'][$body];
        }

        if (isset(Map::BODY_STYLE_MAP['BY_MODEL'][$model])) {
            return Map::BODY_STYLE_MAP['BY_MODEL'][$model];
        }

        return $body;
    }

    private function translateCab(): string
    {
        $value = $this->version->cab;
        if (isset(Map::CAB_MAP[$value])) {
            return Map::CAB_MAP[$value];
        } else {
            return $value;
        }
    }

    private function translateNumberDoors()
    {
        $doors = $this->version->doors;

        if (in_array($this->version->body_style, [
            'Sport Utility Vehicle',
        ])) {
            $doors = $doors - 1;
        }

        return $doors;
    }

    private function translateTransmission()
    {
        $transmission = $this->version->transmission_type;
        if ($transmission) {
            return Map::TRANSMISSION_MAP[$transmission];
        }
    }

    private function translateDrivenWheels()
    {
        $value = $this->version->driven_wheels;

        if (isset(Map::DRIVEN_WHEELS_MAP['BY_VERSION_NAME'][$this->version->name])) {
            return Map::DRIVEN_WHEELS_MAP['BY_VERSION_NAME'][$this->version->name];
        } else {
            return $value;
        }
    }

    private function translateDisplacement()
    {
        if (isset(Map::DISPLACEMENT_MAP['BY_VERSION_NAME'][$this->version->name])) {
            return Map::DISPLACEMENT_MAP['BY_VERSION_NAME'][$this->version->name];
        }
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
            'driven_wheels' => $this->translateDrivenWheels(),
            'cab' => $this->version->cab ? $this->translateCab() : null,
            'transmission' => $this->translateTransmission(),
            'displacement' => $this->translateDisplacement(),
        ];

        $codes = explode('-', str_replace(['/'], '-', $this->version->manufacturer_code));
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
        if (! $force && $data = Cache::tags('ris')->get('ris-makes')) {
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

    private function fetchVehicles()
    {
        $results = Cache::remember('ris-make-'.$this->version->model->make->name.Map::REGIONS['detroit'], 240, function () {
            try {
                $results = $this->client->vehicle->findByMakeAndPostalcode(
                    $this->version->model->make->name,
                    Map::REGIONS['detroit']
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
        $hints = explode(',', $hints);
        foreach ($hints as $hint) {
            $hint = explode(':', $hint);
            if (count($hint) !== 2) {
                continue;
            }

            if (! isset($results[$hint[0]])) {
                $results[$hint[0]] = [];
            }

            $results[$hint[0]][] = strtolower($hint[1]);
        }

        return (object) $results;
    }

    private function parseVehicles(Collection $vehicles)
    {
        return $vehicles
            ->map(function ($vehicle) {
                $data = new \stdClass();
                $data->filters = $this->parseHints($vehicle->vehicleHints);
                if (isset($vehicle->modelYear)) {
                    $data->filters->YEAR = [
                        $vehicle->modelYear,
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
            if (! isset($vehicle->filters->YEAR)) {
                return true;
            }

            return in_array($params['year'], $vehicle->filters->YEAR);
        });

        $vehicles = array_filter($vehicles, function ($vehicle) use ($params) {
            return in_array($params['model'], $vehicle->filters->MODEL);
        });

        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL_CODE', $params['model_code']);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'PACKAGE_CODE', $params['model_code']);

        // Optional
        // Two vehicles means we've found a lease and a non lease option.
        if (count($vehicles) > 2) {
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'PACKAGE_CODE', $params['trim']);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'TRIM', $params['trim']);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL', $params['trim']);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'DRIVE_TYPE_CODE', [$params['driven_wheels']]);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'BODY_TYPE', [$params['cab']]);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'BODY_TYPE', [$params['body']]);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'TRAN_TYPE', [$params['transmission']]);
            $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'DISPLACEMENT', [$params['displacement']]);
        }

        return collect($vehicles)->map(function ($item) {
            return $item->vehicle;
        });
    }

    private function selectVehicles()
    {
        foreach ($this->vehicles as $vehicle) {
            foreach ($vehicle->cashDealScenarios as $scenario) {
                if ($scenario->dealScenarioTypeName == 'Manufacturer - Standard APR') {
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
            if (! $vehicle) {
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
        if (! $this->selected['lease']) {
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

    /**
     * @param \stdClass $data
     * @param \stdClass $vehicle
     * @return \stdClass
     */
    private function buildCashRates(\stdClass $data, \stdClass $vehicle): \stdClass
    {
        $data->rate = 0;
        $data->term = 0;

        if (isset($vehicle->scenarios['Manufacturer - Standard APR'])) {
            $data->rebate = $vehicle->scenarios['Manufacturer - Standard APR']->consumerCash->totalConsumerCash;
        } else {
            $data->rebate = 0;
        }

        return $data;
    }

    /**
     * @param \stdClass $data
     * @param \stdClass $vehicle
     * @return \stdClass
     */
    private function buildFinancingRates(\stdClass $data, \stdClass $vehicle): \stdClass
    {
        $data->rate = 5;
        $data->term = 60;

        if (isset($vehicle->scenarios['Manufacturer - Standard APR'])) {
            $data->rebate = $vehicle->scenarios['Manufacturer - Standard APR']->consumerCash->totalConsumerCash;
        } else {
            $data->rebate = 0;
        }

        return $data;
    }

    /**
     * @param \stdClass $data
     * @param \stdClass $vehicle
     * @return \stdClass
     */
    private function buildLeaseRates(\stdClass $data, \stdClass $vehicle): \stdClass
    {
        $scenario = null;

        if (isset($vehicle->scenarios['Manufacturer - Lease Special']) && isset($vehicle->scenarios['Manufacturer - Lease Special']->programs[0])) {
            $scenario = $vehicle->scenarios['Manufacturer - Lease Special'];
        } elseif (isset($vehicle->scenarios['Affiliate - Lease Special']) && isset($vehicle->scenarios['Affiliate - Lease Special']->programs[0])) {
            $scenario = $vehicle->scenarios['Affiliate - Lease Special'];
        }

        $data->rate = 0;
        $data->term = 0;
        $data->rebate = 0;
        $data->residual = null;
        $data->miles = null;
        $data->rateType = null;

        if (! $scenario) {
            return $data;
        }

        if (! count($scenario->programs)) {
            return $data;
        }

        $program = reset($scenario->programs);

        if (isset($program->consumerCash)) {
            $data->rebate = $program->consumerCash->totalConsumerCash;
        } else {
            $data->rebate = 0;
        }

        $terms = collect($program->tiers[0]->leaseTerms)
            ->reject(function ($term) {
                return ! isset($term->adjRate) || ! $term->adjRate || ! is_numeric($term->adjRate);
            })->all();

        if (! count($terms)) {
            return $data;
        }

        $data->rateType = $program->rateType;
        $data->term = get_closet_number(array_keys($terms), 36);
        $data->rate = $terms[$data->term]->adjRate;

        if (isset($terms[$data->term]->ccrCash)) {
            $data->rebate += $terms[$data->term]->ccrCash->totalCCR;
        }

        $data->miles = get_closet_number(array_keys($program->residuals), 10000);

        if (isset($program->residuals[$data->miles]->termValues[$data->term])) {
            $data->residual = $program->residuals[$data->miles]->termValues[$data->term]->percentage;
        }

        return $data;
    }

    private function selectRates()
    {
        foreach ($this->selected as $strategy => $vehicle) {
            if (! $vehicle) {
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
                    $data = $this->buildCashRates($data, $vehicle);
                    break;
                case 'finance':
                    $data = $this->buildFinancingRates($data, $vehicle);
                    break;
                case 'lease':
                    $data = $this->buildLeaseRates($data, $vehicle);
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
        $this->makes = null;
        $this->vehicles = null;
        $this->selected = [
            'cash' => null,
            'finance' => null,
            'lease' => null,
        ];
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

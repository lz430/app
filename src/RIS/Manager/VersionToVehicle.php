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
        'Ram 1500 Pickup' => '1500',
    ];

    private const TRIM_MAP = [
        'BY_MODEL' => [

        ],
        'BY_TRIM' => [
            'Momentum' => 'T6 Momentum',
            '230i' => '230',
            '330i' => 'i330',
            '430i' => '430',
            '530i' => '530',
            'M550i' => 'M550',
            '340i' => '340',
            'Big Horn' => 'Big Horn/Lone Star',
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
     * @param Version $version
     * @param RISClient $client
     */
    public function __construct(Version $version, RISClient $client)
    {
        $this->version = $version;
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
            if (!isset($record->{$parentAttribute}->{$attribute})) {
                return true;
            }

            if (isset($record->{$parentAttribute}->{$attribute}) && count(array_intersect($value, $record->{$parentAttribute}->{$attribute}))) {
                return true;
            }

            return false;

        });

        if (count($recordsWith)) {
            return $recordsWith;
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
    private function getClosetNumber(array $arr, $search) {
        $closest = null;
        foreach ($arr as $item) {
            if ($closest === null || abs($search - $closest) > abs($item - $search)) {
                $closest = $item;
            }
        }
        return $closest;
    }

    private function translateTrimName(): string
    {
        $trim = $this->version->trim_name;
        $model = $this->version->model->name;

        if (isset(self::TRIM_MAP['BY_MODEL'][$model])) {
            return self::TRIM_MAP['BY_MODEL'][$model];
        }

        if (isset(self::TRIM_MAP['BY_TRIM'][$trim])) {
            return self::TRIM_MAP['BY_TRIM'][$trim];
        }

        return $trim;
    }

    private function translateModel(): string
    {
        $model = $this->version->model->name;

        if (isset(self::MODEL_MAP[$model])) {
            return self::MODEL_MAP[$model];
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
        return $params;
    }

    private function fetchMakeHashcodes() {
        $results = Cache::remember('ris-makes', 1440, function () {
            try {
                $response = $this->client->hashcode->makes();
                $results = [];
                foreach($response->response as $make) {
                    $results[strtolower($make->makeName)] = $make;
                }
            } catch (ClientException $exception) {
                $results = [];
            }

            return $results;
        });

        if ($results) {
            $results = collect($results);
        }
        $this->makes = $results;
    }

    /**
     *
     */
    private function fetchVehicles()
    {
        $results = Cache::remember('ris-make-' . $this->version->model->make->name . self::REGIONS['detroit'], 1440, function () {
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
        $vehicles = array_filter($vehicles, function($vehicle) use ($params) {
            if (!isset($vehicle->filters->YEAR)) {
                return true;
            }
            return in_array($params['year'], $vehicle->filters->YEAR);
        });

        $vehicles = array_filter($vehicles, function($vehicle) use ($params) {
            return in_array($params['model'], $vehicle->filters->MODEL);
        });


        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL_CODE', $params['model_code']);

        // Optional
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'PACKAGE_CODE', [$params['trim']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'TRIM', [$params['trim']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'MODEL', [$params['trim']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'DRIVE_TYPE_CODE', [$params['driven_wheels']]);
        $vehicles = $this->filterUnlessNone($vehicles, 'filters', 'BODY_TYPE', [$params['cab']]);
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

    private function selectRates() {
        foreach($this->selected as $strategy => $vehicle) {
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
                    //
                    // Only tracking lease specials right now...
                    if (!isset($vehicle->scenarios['Manufacturer - Lease Special']) || !isset($vehicle->scenarios['Manufacturer - Lease Special']->programs[0])) {
                        $data->rate = 0;
                        $data->term = 0;
                        $data->rebate = 0;

                    } else {
                        $scenario = $vehicle->scenarios['Manufacturer - Lease Special'];

                        if (isset($scenario->programs[0]->consumerCash)) {
                            $data->rebate = $scenario->programs[0]->consumerCash->totalConsumerCash;
                        } else {
                            $data->rebate = 0;
                        }

                        $data->rateType = $scenario->programs[0]->rateType;
                        $data->term = $this->getClosetNumber(array_keys($scenario->programs[0]->tiers[0]->leaseTerms), 36);
                        $data->rate = $scenario->programs[0]->tiers[0]->leaseTerms[$data->term]->adjRate;

                        if (isset($scenario->programs[0]->tiers[0]->leaseTerms[$data->term]->ccrCash)) {
                            $data->rebate += $scenario->programs[0]->tiers[0]->leaseTerms[$data->term]->ccrCash->totalCCR;
                        }

                        $data->miles = $this->getClosetNumber(array_keys($scenario->programs[0]->residuals), 10000);

                        if (isset($scenario->programs[0]->residuals[$data->miles]->termValues[$data->term])){
                            $data->residual = $scenario->programs[0]->residuals[$data->miles]->termValues[$data->term]->percentage;
                        } else {
                            $data->rate = 0;
                            $data->term = 0;
                            $data->rebate = 0;
                            $data->residual = null;
                            $data->miles = null;
                            $data->rateType;
                        }
                    }
                    break;
            }
            $data->data = $vehicle;

            $this->selected[$strategy] = $data;
        }
    }

    public function get()
    {
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
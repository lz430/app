<?php

namespace DeliverMyRide\VAuto;

use App\Models\Deal;
use App\Models\JATO\Make;
use App\Models\JATO\Version;
use App\Models\JATO\Manufacturer;
use App\Models\JATO\VehicleModel;
use App\Models\JATO\VersionQuote;
use App\Models\Equipment;
use App\Models\Option;
use App\Models\StandardText;
use Illuminate\Support\Facades\DB;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;

class VersionMunger
{
    private $jatoClient;

    private $row;
    private $decodedVin;
    private $version;
    private $jatoVersion;
    private $debug = [];

    /**
     * @param JatoClient $jatoClient
     */
    public function __construct(JatoClient $jatoClient)
    {
        $this->jatoClient = $jatoClient;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function decodeVin()
    {
        try {
            $decodedVin = $this->jatoClient->vin->decode($this->row['VIN']);
        } catch (\Exception $e) {
            $decodedVin = null;
        }
        $this->decodedVin = $decodedVin;
    }

    /**
     * @return null|\stdClass
     */
    private function matchVinToVersion(): ?\stdClass
    {
        $row = $this->row;
        $this->debug['possible_versions'] = count($this->decodedVin->versions);

        $matches = $this->decodedVin->versions;

        if (! count($matches)) {
            return null;
        }

        // Only Current
        if (count($matches) > 1) {
            // Remove matches that aren't current
            // TODO: Should we bump this out of the if statement? with this vehicles will match
            // there is only one version and not current.
            $matches = array_filter($matches, function ($version) use ($row) {
                return $version->isCurrent;
            });
        }

        // Model codes
        if (count($matches) > 1) {
            $matches = array_filter($matches,
                function ($version) use ($row) {
                    $match =
                        str_contains($version->modelCode, $row['Model Code']) ||
                        str_contains($version->localModelCode, $row['Model Code']);

                    return $match;
                });
        }

        // Match on trim (easy)
        if (count($matches) > 1) {
            $trimMatches = array_filter($matches, function ($version) use ($row) {
                return $version->trimName == $row['Series'];
            });

            // Only if we actually have some matches do we use use this information.
            if (count($trimMatches)) {
                $matches = $trimMatches;
            }
        }

        // Fuzzy match version name.
        if (count($matches) > 1) {
            $trim = $row['Series'];

            if ($row['Series Detail']) {
                $trim .= ' '.$row['Series Detail'];
            }

            // Try and specific match first
            $trimMatches = array_filter($matches, function ($version) use ($row, $trim) {
                return $version->versionName == $trim;
            });

            // No specific trim matches found...
            if (count($trimMatches)) {
                $matches = $trimMatches;
            } else {
                foreach ($matches as $match) {
                    $match->versionNameSimilarity = levenshtein($trim, $match->versionName);
                }

                $trimMatches = $matches;
                usort($trimMatches, function ($a, $b) {
                    if ($a->versionNameSimilarity == $b->versionNameSimilarity) {
                        return 0;
                    }

                    if ($a->versionNameSimilarity < $b->versionNameSimilarity) {
                        return -1;
                    }

                    return 1;
                });

                $matches = [
                    $trimMatches[0],
                ];

                $this->debug['name_search_score'] = $matches[0]->versionNameSimilarity;
                $this->debug['name_search_name'] = $matches[0]->versionName;
                $this->debug['name_search_term'] = $trim;
            }
        }

        if (count($matches) === 0) {
            return null;
        } elseif (count($matches) === 1) {
            return end($matches);
        } else {
            return end($matches);
        }
    }

    /**
     * @param string $name
     * @return Manufacturer
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function manufacturer(string $name): Manufacturer
    {
        $manufacturer = Manufacturer::where('name', $name)->first();

        if (! $manufacturer) {
            $data = $this->jatoClient->manufacturer->get($name);

            $manufacturer = Manufacturer::updateOrCreate([
                'url_name' => $data->urlManufacturerName,
            ], [
                'name' => $data->manufacturerName,
                'url_name' => $data->urlManufacturerName,
                'is_current' => $data->isCurrent,
            ]);
        }

        return $manufacturer;
    }

    /**
     * @param string $name
     * @param Manufacturer $manufacturer
     * @return Make
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function make(string $name, Manufacturer $manufacturer): Make
    {
        $make = Make::where('name', $name)->first();

        if (! $make) {
            $data = $this->jatoClient->make->get($name);

            $make = $manufacturer->makes()->updateOrCreate([
                'url_name' => $data->urlMakeName,
            ], [
                'name' => $data->makeName,
                'url_name' => $data->urlMakeName,
                'is_current' => $data->isCurrent,
            ]);
        }

        return $make;
    }

    /**
     * @param string $name
     * @param string $urlModelName
     * @param Make $make
     * @return VehicleModel
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function model(string $name, string $urlModelName, $make): VehicleModel
    {
        //
        // Turns out models aren't unique.
        // Both Lincoln and Lexus have a "LS" Model. Classy.
        $model = VehicleModel::where('name', $name)
            ->whereHas('make', function ($query) use ($make) {
                $query->where('id', '=', $make->id);
            })
            ->first();

        if (! $model) {
            $data = $this->jatoClient->model->get($urlModelName);

            $model = $make->models()->updateOrCreate([
                'url_name' => $data->urlModelName,
            ], [
                'name' => $data->modelName,
                'url_name' => $data->urlModelName,
                'is_current' => $data->isCurrent,
            ]);
        }

        return $model;
    }

    /**
     * @param $vehicleId
     * @param $versionId
     */
    private function equipment($vehicleId, $versionId)
    {
        $getEquipment = collect($this->client->equipment->get($vehicleId)->results);
        $equipment = $getEquipment
            ->reject(function ($equipment){
                return ! in_array($equipment->availability, ['standard', 'optional']);
            });

        foreach($equipment as $equip) {
            $data = [
                'version_id' => $versionId,
                'option_id' => $equip->optionId,
                'schema_id' => $equip->schemaId,
                'category_id' =>$equip->categoryId,
                'category' => $equip->category,
                'name' => $equip->name,
                'location' => $equip->location,
                'availability' => $equip->availability,
                'value' => $equip->value,
                'attributes' => json_encode($equip->attributes),
            ];
            Equipment::updateOrCreate($data);
        }
    }

    /**
     * @param $vehicleId
     * @param $versionId
     */
    private function options($vehicleId, $versionId)
    {
        $getOptions = collect($this->client->option->get($vehicleId)->options);
        $options = $getOptions
            ->reject(function ($options){
                return ! in_array($options->optionType, ['O', 'P']);
            });

        foreach($options as $option) {
            $data = [
                'version_id' => $versionId,
                'option_id' => $option->optionId,
                'option_code' => $option->optionCode,
                'option_type' => $option->optionType,
                'msrp' => $option->msrp,
                'invoice_price' => $option->invoicePrice,
                'option_name' => $option->optionName,
                'option_state_name' => $option->optionStateTranslation,
                'option_state' => $option->optionState,
                'option_description' => $option->optionDescription,
            ];
            Option::updateOrCreate($data);
        }
    }

    /**
     * @param $vehicleId
     * @param $versionId
     */
    private function stardardText($vehicleId, $versionId)
    {
        $getStandardText = collect($this->client->standard->get($vehicleId, '', '', '1', '5000')->results);
        foreach($getStandardText as $standard) {
            $data = [
                'version_id' => $versionId,
                'schema_id' => $standard->schemaId,
                'category_id' =>$standard->categoryId,
                'category' => $standard->category,
                'item_name' => $standard->itemName,
                'content' => $standard->content,

            ];
            StandardText::updateOrCreate($data);
        }
    }



    /**
     * @param $vehicleId
     * @return null|\stdClass
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function getJatoVersion($vehicleId)
    {
        $data = null;
        try {
            $data = $this->jatoClient->version->get($vehicleId);
        } catch (ClientException $e) {
            echo $e->getMessage();
        }

        return $data;
    }

    private function getManufacturerByMake($make)
    {
        $data = $this->jatoClient->make->get($make);

        return $data->manufacturerName;
    }

    /**
     * @return Version
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function create(): ?Version
    {
        $data = $this->getJatoVersion($this->jatoVersion->vehicle_ID);

        if (! $data) {
            return null;
        }

        $manufacturer = $this->manufacturer($this->decodedVin->manufacturer);
        $make = $this->make($this->decodedVin->make, $manufacturer);
        $model = $this->model($this->decodedVin->model, $this->jatoVersion->urlModelName, $make);

        /* @var Version $version */
        $version = $model->versions()->create([
            'jato_vehicle_id' => $data->vehicleId,
            'jato_uid' => $data->uid,
            'jato_model_id' => $data->modelId,
            'year' => str_before($data->modelYear, '.'), // trim off .5
            'name' => ! in_array($data->versionName, ['-', '']) ? $data->versionName : null,
            'trim_name' => $data->trimName,
            'description' => rtrim($data->headerDescription, ' -'),
            'driven_wheels' => $data->drivenWheels,
            'doors' => $data->numberOfDoors,
            'transmission_type' => $data->transmissionType,
            'msrp' => $data->msrp !== '' ? $data->msrp : null,
            'invoice' => $data->invoice !== '' ? $data->invoice : null,
            'body_style' => $data->bodyStyleName,
            'cab' => $data->cabType !== '' ? $data->cabType : null,
            'fuel_econ_city' => $data->fuelEconCity !== '' ? $data->fuelEconCity : null,
            'fuel_econ_hwy' => $data->fuelEconHwy !== '' ? $data->fuelEconHwy : null,
            'manufacturer_code' => ! in_array($data->manufacturerCode, ['-', '']) ? $data->manufacturerCode : null,
            'delivery_price' => $data->delivery !== '' ? $data->delivery : null,
            'is_current' => $data->isCurrent,
        ]);

        $this->equipment($data->vehicleId, $version->id);
        $this->options($data->vehicleId, $version->id);
        $this->stardardText($data->vehicleId, $version->id);

        return $version;
    }

    /**
     * Clear all photos attached to the version and get some basic defaults we can use.
     * All versions need photos for the intro page.
     *
     * @param Version $version
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function photos(Version $version)
    {
        $this->debug['versionPhotos'] = 0;
        $assets = resolve('DeliverMyRide\Fuel\Manager\VersionToFuel')->assets($version);
        $version->photos()->where('type', 'default')->delete();

        if (count($assets) > 0) {
            $this->debug['versionPhotos']++;
        }

        foreach ($assets as $asset) {
            $version->photos()->updateOrCreate(
                [
                    'url' => $asset->url,
                ],
                [
                    'type' => 'default',
                    'shot_code' => $asset->shotCode->code,
                    'color' => null,
                    'description' => isset($asset->shotCode->description) ? trim($asset->shotCode->description) : null,
                ]);
        }
    }

    /**
     * @param Version $version
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function quotes(Version $version)
    {
        $quoteData = resolve('DeliverMyRide\RIS\Manager\VersionToVehicle')->get($version);

        foreach ($quoteData as $strategy => $data) {
            if (! $data) {
                $version->quotes()->where('strategy', $strategy)->delete();
            } else {
                VersionQuote::updateOrCreate([
                    'strategy' => $strategy,
                    'version_id' => $version->id,
                ], [
                    'hashcode' => $data->hashcode,
                    'make_hashcode' => $data->makeHashcode,
                    'rate' => (float) $data->rate,
                    'term' => (int) $data->term,
                    'rebate' => (int) $data->rebate,
                    'residual' => (int) $data->residual,
                    'miles' => (int) $data->miles,
                    'rate_type' => $data->rateType,
                    'data' => $data->data,
                ]);
            }
        }
    }

    /**
     * @param Version $version
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function refreshMakeModel(Version $version)
    {
        $data = $this->getJatoVersion($version->jato_vehicle_id);
        if (! $data) {
            return false;
        }
        $manufacturerName = $this->getManufacturerByMake($data->makeName);

        $manufacturer = $this->manufacturer($manufacturerName);
        $make = $this->make($data->makeName, $manufacturer);
        $model = $this->model($data->modelName, $data->modelName, $make);
        $version->model()->associate($model);
        $version->save();
    }

    /**
     * @param Version $version
     * @param \stdClass $jatoVersion
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function refresh(Version $version, \stdClass $jatoVersion)
    {
        //
        // Update vehicle id
        $version->update(['jato_vehicle_id' => $jatoVersion->vehicle_ID]);

        //
        // New photos
        $this->photos($version);

        //
        // Ensure existing deals attached to this version are forced to refresh.
        /* @var Deal $attachedDeal */
        foreach ($version->fresh()->deals as $attachedDeal) {
            if ($attachedDeal->status == 'available') {
                $attachedDeal->features()->sync([]);
                $attachedDeal->jatoFeatures()->sync([]);
            }
        }

        //Refresh equipment/options/standard text for versions
        DB::table('equipment')->where('version_id', $version->id)->delete();
        DB::table('options')->where('version_id', $version->id)->delete();
        DB::table('standard_texts')->where('version_id', $version->id)->delete();
        $this->equipment($jatoVersion->vehicle_ID, $version->id);
        $this->options($jatoVersion->vehicle_ID, $version->id);
        $this->stardardText($jatoVersion->vehicle_ID, $version->id);
    }

    /**
     * @param array $row
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function build(array $row): array
    {
        $this->row = $row;

        //
        // Match Jato Version
        $this->decodeVin();
        if (! $this->decodedVin) {
            return [false, false, false];
        }

        $jatoVersion = $this->matchVinToVersion();
        if (! $jatoVersion) {
            return [false, false, false];
        }

        $this->jatoVersion = $jatoVersion;
        $this->debug['versionsCreated'] = 0;
        $this->debug['versionsUpdated'] = 0;
        //
        // Decide if we need to create
        $version = Version::where('jato_uid', $jatoVersion->uid)->where('year', $this->row['Year'])->first();
        if (! $version) {
            $version = $this->create();
            $this->debug['versionsCreated']++;
            if ($version) {
                $this->photos($version);
                $this->quotes($version);
            }
        }

        if (! $version) {
            return [false, false, false];
        }

        //
        // If the vehicle id has changed we need to update the vehicle id.
        if ($version->jato_vehicle_id != $jatoVersion->vehicle_ID) {
            $this->refresh($version, $jatoVersion);
            $this->debug['versionsUpdated']++;
        }

        if (! $version->photos()->count()) {
            $this->photos($version);
        }

        return [$version, $this->debug];
    }
}

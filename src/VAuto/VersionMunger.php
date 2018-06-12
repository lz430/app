<?php

namespace DeliverMyRide\VAuto;

use App\Models\JATO\Make;
use App\Models\JATO\Manufacturer;
use App\Models\JATO\VehicleModel;
use App\Models\JATO\Version;
use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\VersionToFuel;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;



class VersionMunger
{

    private $jatoClient;
    private $fuelClient;
    private $row;
    private $decodedVin;
    private $version;
    private $jatoVersion;
    private $debug = [];

    /**
     * @param array $row
     * @param \stdClass $decodedVin
     * @param JatoClient $jatoClient
     * @param FuelClient $fuelClient
     */
    public function __construct(array $row, \stdClass $decodedVin, JatoClient $jatoClient, FuelClient $fuelClient)
    {
        $this->jatoClient = $jatoClient;
        $this->fuelClient = $fuelClient;
        $this->decodedVin = $decodedVin;
        $this->row = $row;
    }

    /**
     * @return null|\stdClass
     */
    private function matchVinToVersion(): ?\stdClass
    {
        $row = $this->row;
        $this->debug['possible_versions'] = count($this->decodedVin->versions);

        $matches = $this->decodedVin->versions;

        if (!count($matches)) {
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
                $trim .= " " . $row['Series Detail'];
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
                    $trimMatches[0]
                ];

                $this->debug['name_search_score'] = $matches[0]->versionNameSimilarity;
                $this->debug['name_search_name'] = $matches[0]->versionName;
                $this->debug['name_search_term'] = $trim;
            }


        }

        if (count($matches) === 0) {
            return null;
        } else if (count($matches) === 1) {
            return end($matches);
        } else {
            return end($matches);
        }

    }

    /**
     * @return Manufacturer
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function manufacturer(): Manufacturer
    {
        $manufacturer = Manufacturer::where('name', $this->decodedVin->manufacturer)->first();

        if (!$manufacturer) {
            $data = $this->jatoClient->manufacturer->get($this->decodedVin->manufacturer);

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
     * @param Manufacturer $manufacturer
     * @return Make
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function make(Manufacturer $manufacturer): Make
    {
        $make = Make::where('name', $this->decodedVin->make)->first();

        if (!$make) {
            $data = $this->jatoClient->make->get($this->decodedVin->make);

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
     * @param Make $make
     * @return VehicleModel
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function model(Make $make): VehicleModel
    {
        $model = VehicleModel::where('name', $this->decodedVin->model)->first();

        if (!$model) {
            $data = $this->jatoClient->model->get($this->jatoVersion->urlModelName);

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
     * @return Version
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function create(): Version
    {
        $data = $this->jatoClient->version->get($this->jatoVersion->vehicle_ID);

        $manufacturer = $this->manufacturer();
        $make = $this->make($manufacturer);
        $model = $this->model($make);

        $version = $model->versions()->create([
            'jato_vehicle_id' => $data->vehicleId,
            'jato_uid' => $data->uid,
            'jato_model_id' => $data->modelId,
            'year' => str_before($data->modelYear, '.'), // trim off .5
            'name' => !in_array($data->versionName, ['-', '']) ? $data->versionName : null,
            'trim_name' => $data->trimName,
            'description' => rtrim($data->headerDescription, ' -'),
            'driven_wheels' => $data->drivenWheels,
            'doors' => $data->numberOfDoors,
            'transmission_type' => $data->transmissionType,
            'msrp' => $data->msrp !== '' ? $data->msrp : null,
            'invoice' => $data->invoice !== '' ? $data->invoice : null,
            'body_style' => $data->bodyStyleName,
            'cab' => $data->cabType !== '' ? $data->cabType : null,
            'photo_path' => $data->photoPath,
            'fuel_econ_city' => $data->fuelEconCity !== '' ? $data->fuelEconCity : null,
            'fuel_econ_hwy' => $data->fuelEconHwy !== '' ? $data->fuelEconHwy : null,
            'manufacturer_code' => !in_array($data->manufacturerCode, ['-', '']) ? $data->manufacturerCode : null,
            'delivery_price' => $data->delivery !== '' ? $data->delivery : null,
            'is_current' => $data->isCurrent,
        ]);

        $this->photos($version);

        return $version;
    }

    /**
     * Clear all photos attached to the version and get some basic defaults we can use.
     * All versions need photos for the intro page.
     * @param Version $version
     */
    private function photos(Version $version)
    {
        $assets = (new VersionToFuel($version, $this->fuelClient))->assets('default');
        $version->photos()->delete();

        foreach ($assets as $asset) {
            $version->photos()->create([
                'url' => $asset->url,
                'shot_code' => $asset->shotCode->code,
                'color' => 'default',
            ]);
        }
    }

    /**
     * This happens when the jato vehicle id changed, meaning the spec for the actual vehicle is different
     * for whatever reason
     * @param Version $version
     * @param \stdClass $jatoVersion
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
        foreach ($version->fresh()->deals as $attachedDeal) {
            $attachedDeal->features()->sync([]);
            $attachedDeal->jatoFeatures()->sync([]);
        }
    }

    /**
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function build(): array
    {
        //
        // Match Jato Version
        $jatoVersion = $this->matchVinToVersion();
        if (!$jatoVersion) {
            return [FALSE, FALSE, FALSE];
        }
        $this->jatoVersion = $jatoVersion;

        //
        // Decide if we need to create
        $version = Version::where('jato_uid', $jatoVersion->uid)->where('year', $this->row['Year'])->first();
        if (!$version) {
            $version = $this->create();
        }

        //
        // If the vehicle id has changed we need to update the vehicle id.
        if ($version->jato_vehicle_id != $jatoVersion->vehicle_ID) {
            $this->refresh($version, $jatoVersion);
        }

        if (!$version->photos()->count()) {
            $this->photos($version);
        }

        return [$version, $this->debug];
    }

}
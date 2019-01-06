<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use App\Models\Feature;
use DeliverMyRide\VAuto\Map;
use App\Models\JATO\Equipment;

/**
 * Handles finding and fixing up the packages and options found for a given vehicle.
 */
class DealOptionsMunger
{
    private $debug;
    private $deal;
    private $version;
    private $option_codes;

    /* @var \Illuminate\Support\Collection */
    private $vauto_features;

    /* @var \Illuminate\Support\Collection */
    private $possiblePackagesAndOptions;

    /**
     * TODO: There is no good way right now to figure out if we 'should' update this..
     * so we're going to just update it every time. Fix this.
     * @param Deal $deal
     * @param bool $force
     * @return array
     */
    public function import(Deal $deal, bool $force = false)
    {
        $this->deal = $deal;
        $this->version = $this->deal->version;
        $this->possiblePackagesAndOptions = $deal->version->options;

        //
        // Reset importer class
        $this->vauto_features = [];

        $this->debug = [
            'options_extracted_codes' => [],
            'options_skipped' => 'No',
        ];

        if (! $this->possiblePackagesAndOptions->count()) {
            return $this->debug;
        }

        $this->processVautoFeature();

        //
        // Option codes & package codes
        $this->buildOptionsAndPackages();

        $this->deal->save();

        return $this->debug;
    }

    public function buildOptionsAndPackages()
    {
        $packages = $this->deal->package_codes ? $this->deal->package_codes : [];
        $options = $this->deal->option_codes ? $this->deal->option_codes : [];

        //
        // Find packages and options.
        $packagesAndOptions = array_merge($packages, $options);
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractPackageCodesFromVautoFeatures());
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractAdditionalOptionCodes());
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractPackagesOrOptionsFromTransmission());
        $packagesAndOptions = array_filter($packagesAndOptions);
        $packagesAndOptions = array_unique($packagesAndOptions);

        //
        // Split up packages and options,a and validate against known possible packages and options.
        $packages = $this->possiblePackagesAndOptions
            ->reject(function ($package) {
                return $package->option_type != 'P';
            })
            ->reject(function ($package) use ($packagesAndOptions) {
                return ! in_array($package->option_code, $packagesAndOptions);
            })
            ->pluck('option_code')
            ->all();

        $options = $this->possiblePackagesAndOptions
            ->reject(function ($package) {
                return $package->option_type != 'O';
            })
            ->reject(function ($option) use ($packagesAndOptions) {
                return ! in_array($option->option_code, $packagesAndOptions);
            })
            ->pluck('option_code')
            ->all();

        $this->deal->package_codes = $packages;
        $this->deal->option_codes = $options;
    }

    /**
     * Attempts to extract additional option codes for a given deal by checking how similar
     * a vauto feature is to a known jato optional equipment. if a feature is pretty close we assume
     * it's an option code the deal has and attach it to the vehicle.
     *
     * TODO:
     *  - Alloy Seats vs Black Seats returns "4"
     */
    public function extractAdditionalOptionCodes()
    {
        $options = $this->possiblePackagesAndOptions
            ->keyBy('option_code')
            ->map(function ($option) {
                return $option->option_name;
            })
            ->all();

        $features = explode('|', $this->deal->vauto_features);
        $features = array_map('trim', $features);

        $additional_option_codes = [];

        foreach ($features as $feature) {
            foreach ($options as $code => $option_name) {
                $score = levenshtein($option_name, $feature);
                if ($score < 5) {
                    $this->debug['options_extracted_codes'][] = [
                        'Option Code' => $code,
                        'Option Title' => $option_name,
                        'Feature' => $feature,
                        'Score' => $score,
                    ];
                    $additional_option_codes[] = $code;
                }
            }
        }

        return $additional_option_codes;
    }

    /**
     * @return array
     */
    private function extractPackageCodesFromVautoFeatures()
    {
        $packageCodes = [];

        $rules = [
            "/(?<=(?i)Quick Order Package )(.*?)(?=\|| )/",
            "/(?<=(?i)Preferred Equipment Group )(.*?)(?=\|| )/",
            "/(?<=(?i)Equipment Group )(.*?)(?=\|| )/",
        ];

        foreach ($rules as $rule) {
            $matches = [];
            preg_match($rule, $this->deal->vauto_features, $matches);
            if (count($matches)) {
                $packageCodes += $matches;
            }
        }
        $packageCodes = array_unique($packageCodes);

        return $packageCodes;
    }

    /**
     * In many situations manual trans is standard and option codes / vauto features do not have any info
     * regarding transmission, so we see if we've got any options or packages for transmissions that might match.
     */
    private function extractPackagesOrOptionsFromTransmission()
    {
        $transmission = $this->deal->transmission;
        if (isset(Map::VAUTO_TRANSMISSION_TO_JATO_PACKAGE[$transmission])) {
            $transmission = Map::VAUTO_TRANSMISSION_TO_JATO_PACKAGE[$transmission];
        }

        // Most packages actually include the word transmission but vauto does not.
        if (! str_contains($transmission, 'Transmission')) {
            $transmission .= ' Transmission';
        }

        // Some transmissions don't fully label automatic
        // TODO: This might be too specific? review spreadsheet and see how often this actually comes up.
        if (str_contains($transmission, 'Auto ')) {
            $transmission = str_replace('Auto ', 'Automatic ', $transmission);
        }

        $codes = $this->possiblePackagesAndOptions
            ->reject(function ($option) use ($transmission) {
                $score = levenshtein($option->option_name, $transmission);
                if ($score < 3) {
                    $this->debug['options_extracted_codes'][] = [
                        'Option Code' => $option->option_code,
                        'Option Title' => $option->option_name,
                        'Feature' => 'Transmission',
                        'Score' => $score,
                    ];

                    return false;
                }

                return true;
            })
            ->map(function ($option) {
                return $option->option_code;
            })
            ->unique()
            ->all();

        return $codes;
    }

    /**
     * Turn the vauto features into something more useful.
     */
    private function processVautoFeature()
    {
        $vautoFeatures = explode('|', $this->deal->vauto_features);
        $vautoFeatures = array_map('trim', $vautoFeatures);

        $collection = collect($vautoFeatures)
            ->map(function ($item) {
                return trim($item);
            })
            ->map(function ($item) {
                return preg_replace('/[\x00-\x1F\x7F\xA0]/u', '', $item);
            })
            ->filter();

        $this->vauto_features = $collection;
    }
}

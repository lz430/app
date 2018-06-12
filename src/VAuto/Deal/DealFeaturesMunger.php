<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\JatoFeature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Support\Collection;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

/**
 *
 */
class DealFeaturesMunger
{
    private $debug;
    private $client;
    private $deal;
    private $version;

    /* @var \Illuminate\Support\Collection */
    private $features;

    /**
     * @param Deal $deal
     * @param JatoClient $client
     */
    public function __construct(Deal $deal, JatoClient $client)
    {

        $this->deal = $deal;
        $this->client = $client;
        $this->version = $this->deal->version;

        $this->debug = [
            'feature_count' => 0,
        ];
    }

    /**
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(bool $force = FALSE)
    {
        if ($force) {
            $this->deal->jatoFeatures()->sync([]);
        }

        if ($this->deal->jatoFeatures()->count()){
            return $this->debug;
        }

        //
        // Get get data sources
        $this->features = $this->fetchVersionFeatures();

        //
        // Do feature things
        $this->saveDealJatoFeatures();
        $this->saveCustomHackyJatoFeatures();

        return $this->debug;
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionFeatures(): Collection
    {
        return collect($this->client->feature->get($this->version->jato_vehicle_id, '', 1, 400)->results);
    }


    private function getCategorizedFeaturesByVehicleId()
    {
        $data = [];

        foreach ($this->features->all() as $feature) {
            if (!isset($data[$feature->categoryId])) {
                $data[$feature->categoryId] = [];
            }
            $data[$feature->categoryId][] = $feature;
        }

        return $data;
    }

    private function saveDealJatoFeatures()
    {
        $features = $this->getCategorizedFeaturesByVehicleId();

        foreach (JatoFeature::SYNC_GROUPS as $group) {
            if (isset($features[$group['id']])) {
                $this->saveDealJatoFeaturesByGroup($features[$group['id']], $group['title']);
            }
        }

    }

    private function saveDealJatoFeaturesByGroup(array $features, string $group)
    {
        collect($features)
            ->reduce(function (Collection $carry, $jatoFeature) {
                return $carry->merge(self::splitJATOFeaturesAndContent($jatoFeature->feature, $jatoFeature->content));
            }, collect())
            ->each(function ($featureAndContent) use ($group) {

                /**
                 * Only interior features that contain "seat" should be added to seating
                 */
                if ($group === JatoFeature::GROUP_SEATING_KEY && !str_contains($featureAndContent['feature'], 'seat')) {
                    return;
                }

                /**
                 * Only add features that have _content_ that starts with "Standard", "Yes".
                 */
                if (starts_with($featureAndContent['content'], ['Standard', 'Yes'])) {
                    try {
                        $feature = JatoFeature::updateOrCreate([
                            'feature' => $featureAndContent['feature'],
                            'content' => $featureAndContent['content'],
                        ], [
                            'feature' => $featureAndContent['feature'],
                            'content' => $featureAndContent['content'],
                            'group' => $this->getGroupWithOverrides($featureAndContent['feature'], $group),
                        ]);

                        $feature->deals()->save($this->deal);
                        $this->debug['feature_count']++;
                    } catch (QueryException $e) {
                        // Already saved.
                    }
                }
            });
    }

    private function getGroupWithOverrides(string $feature, string $group)
    {
        return str_contains($feature, 'seat') ? JatoFeature::GROUP_SEATING_KEY : $group;
    }

    private function saveCustomHackyJatoFeatures()
    {
        if ($this->version->body_style === 'Pickup') {
            try {
                $doorCount = JatoFeature::updateOrCreate([
                    'feature' => "$this->deal->door_count Door",
                    'content' => $this->deal->door_count,
                ], [
                    'feature' => "$this->deal->door_count Door",
                    'content' => $this->deal->door_count,
                    'group' => JatoFeature::GROUP_TRUCK_KEY,
                ]);

                $cabType = JatoFeature::updateOrCreate([
                    'feature' => "{$this->version->cab} Cab",
                    'content' => $this->version->cab,
                ], [
                    'feature' => "{$this->version->cab} Cab",
                    'content' => $$this->version->cab,
                    'group' => JatoFeature::GROUP_TRUCK_KEY,
                ]);

                $doorCount->deals()->save($this->deal);
                $cabType->deals()->save($this->deal);
            } catch (QueryException $e) {
                // Already Saved.
            }
        }
    }

    /**
     * TODO: Figure out what this does.
     * @param $feature
     * @param $content
     * @return array
     */
    public static function splitJATOFeaturesAndContent($feature, $content)
    {
        $all = [];

        if (str_contains($feature, '(')) {
            [$prefix, $suffix] = array_map('trim', explode('(', $feature));

            if (str_contains($suffix, ' / ')) {
                $features = array_map(function ($str) {
                    return trim($str, '() ');
                }, explode(' / ', $suffix));

                $contents = array_map('trim', explode(' / ', $content));

                foreach ($features as $index => $thisfeature) {
                    $all[] = [
                        'feature' => "$prefix $thisfeature",
                        // If there's only one content value for more than one features, grab the first on fail
                        'content' => array_get($contents, $index, reset($contents)),
                    ];
                }
            } else {
                $features = [$prefix, $prefix . ' ' . trim($suffix, '() ')];
                $contents = array_map(function ($str) {
                    return trim($str, ') ');
                }, explode('(', $content));

                if (count($features) != count($contents)) {
                    Log::channel('jato')->debug("Cannot parse feature: title[$feature] content[$content]");
                    return $all;
                }

                foreach ($features as $index => $feature) {
                    $all[] = [
                        'feature' => $feature,
                        'content' => $contents[$index],
                    ];
                }
            }

            return $all;
        } elseif (str_contains($feature, ' / ')) {
            $features = array_map('trim', explode(' / ', $feature));
            $contents = array_map('trim', explode(' / ', $content));

            foreach ($features as $index => $feature) {
                $all[] = [
                    'feature' => $feature,
                    'content' => $contents[$index],
                ];
            }
        } else {
            $all = [
                [
                    'feature' => trim($feature),
                    'content' => trim($content),
                ],
            ];
        }

        return $all;
    }
}

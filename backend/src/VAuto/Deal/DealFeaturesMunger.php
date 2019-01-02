<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

class DealFeaturesMunger
{
    private $debug;
    private $client;
    private $deal;
    private $version;

    /* @var \Illuminate\Support\Collection */
    private $features;

    /**
     * @param JatoClient $client
     */
    public function __construct(JatoClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param Deal $deal
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(Deal $deal, bool $force = false)
    {
        $this->deal = $deal;
        $this->version = $this->deal->version;
        $this->features = null;

        $this->debug = [
            'feature_count' => 0,
            'feature_skipped' => 'Yes',
        ];

        $this->debug['feature_skipped'] = 'No';

        //
        // Get get data sources
        $this->features = $this->fetchVersionFeatures();

        return $this->debug;
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionFeatures(): Collection
    {
        try {
            return collect($this->client->feature->get($this->version->jato_vehicle_id, '', 1, 400)->results);
        } catch (ServerException | ClientException $e) {
            return collect([]);
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
                $features = [$prefix, $prefix.' '.trim($suffix, '() ')];
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

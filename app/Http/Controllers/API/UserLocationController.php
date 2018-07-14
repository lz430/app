<?php

namespace App\Http\Controllers\API;

use App\Services\Search\DealSearch;
use App\Http\Controllers\Controller;
use Geocoder\Laravel\ProviderAndDumperAggregator as Geocoder;
use GuzzleHttp;

class UserLocationController extends Controller
{

    /**
     * Lets just do this the worst way possible.
     *
     * We do this because most of the providers from geocode-php aren't great (don't return zip which is what we need)
     * TODO: Make a provider for the geocoder-php lib that supports ipstack
     */
    private function getLocationForIp($ip)
    {
        $client = new GuzzleHttp\Client(['base_uri' => 'http://api.ipstack.com/']);
        $key = config('services.ipstack.api_key');
        $response = $client->request('GET', $ip, [
            'query' => ['access_key' => $key, 'format' => 1]
        ]);

        $response = json_decode($response->getBody());

        $location = [
            'city' =>  $response->city,
            'zip' => $response->zip,
            'latitude' => $response->latitude,
            'longitude' => $response->longitude,
        ];

        return $location;
    }

    /**
     * @param $geocoder
     * @param $lat
     * @param $lon
     * @return array|null
     */
    private function getLocationForLatLon($geocoder, $lat, $lon)
    {
        $lookup = $geocoder->reverse($lat, $lon)->get()->first();
        return $this->formatGeocoderAddress($lookup);
    }

    /**
     * @param $geocoder
     * @param $address
     * @return array|null
     */
    private function getLocationForAddress($geocoder, $address)
    {
        $lookup = $geocoder->geocode($address)->get()->first();
        return $this->formatGeocoderAddress($lookup);
    }

    /**
     * @param \Geocoder\Provider\GoogleMaps\Model\GoogleAddress $lookup
     * @return array
     */
    private function formatGeocoderAddress($lookup): ?array
    {
        if ($lookup && $lookup->getCoordinates()->getLongitude()) {
            $location = [
                'city' => $lookup->getLocality(),
                'zip' => $lookup->getPostalCode(),
                'latitude' => $lookup->getCoordinates()->getLatitude(),
                'longitude' => $lookup->getCoordinates()->getLongitude(),
            ];
        } else {
            return null;
        }

        return $location;
    }

    /**
     * @param Geocoder $geocoder
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Geocoder $geocoder)
    {
        $this->validate(request(), [
            'search' => 'sometimes',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $location = null;

        /* @var $lookup \Geocoder\Provider\GoogleMaps\Model\GoogleAddress */
        if (request('latitude') && request('longitude')) {
            $location = $this->getLocationForLatLon($geocoder, request('latitude'), request('longitude'));
        } elseif (request('search')) {
            $location = $this->getLocationForAddress($geocoder, request('search'));
        } else {
            $ip = request()->ip();

            // Fix for local development
            if (config('app.env') == 'local') {
                $ip = '68.36.45.13';
            }

            $location = $this->getLocationForIp($ip);
        }

        if ($location) {
            $query = new DealSearch();
            $query = $query->filterMustLocation(['lat' => $location['latitude'], 'lon' =>  $location['longitude']]);
            $query = $query->filterMustGenericRules();
            $query = $query->size(0);
            $results = $query->get();

            if (isset($results['hits']['total']) && intval($results['hits']['total'])) {
                $has_results = true;
            } else {
                $has_results = false;
            }

        } else {
            $has_results = false;
        }

        return response()->json([
            'location' => $location,
            'has_results' => $has_results,
        ]);
    }
}

<?php

namespace App\Http\Controllers\API;
use App\Services\Search\DealSearch;
use App\Http\Controllers\Controller;
use Geocoder\Laravel\ProviderAndDumperAggregator as Geocoder;

class UserLocationController extends Controller
{
    public function show(Geocoder $geocoder)
    {
        $this->validate(request(), [
            'search' => 'sometimes',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $location = null;

        /* @var $lookup \Geocoder\Provider\GoogleMaps\Model\GoogleAddress */

        if (request('latitude') && request('longitude') ) {
            $lookup = $geocoder->reverse(request('latitude'), request('longitude'))->get()->first();
        } elseif (request('search')) {
            $lookup = $geocoder->geocode(request('search'))->get()->first();
        } else {
            $ip = request()->ip();

            // Fix for local development
            if (config('app.env') == 'local') {
                $ip = '68.36.45.13';
            }
            $lookup = $geocoder->geocode($ip)->get()->first();
        }
        if ($lookup && $lookup->getProvidedBy() == 'google_maps' && $lookup->getCoordinates()->getLongitude()) {
            $location = [
                'city' => $lookup->getLocality(),
                'zip' => $lookup->getPostalCode(),
                'latitude' => $lookup->getCoordinates()->getLatitude(),
                'longitude' => $lookup->getCoordinates()->getLongitude(),
            ];
        }
        if ($location) {
            $query = new DealSearch();
            $query = $query->filterMustLocation(['lat' => $lookup->getCoordinates()->getLatitude(), 'lon' => $lookup->getCoordinates()->getLongitude()], 'latlon');
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

<?php

namespace App\Services\Search;

use App\Models\Deal;

/**
 * One specific deal.
 */
class DealDetailSearch extends BaseSearch
{
    public function filterMustDealId($dealId)
    {
        $this->query['query']['bool']['must'][] = [
            'term' => [
                'id' => $dealId,
            ],
        ];

        return $this;
    }

    public function addLocationField($location)
    {
        $lat = (float) $location['lat'];
        $lon = (float) $location['lon'];

        if (! isset($lat)) {
            return $this;
        }

        if (! isset($lon)) {
            return $this;
        }

        $this->query['_source'] = ['*'];
        $this->query['script_fields']['in_range'] = [
            'script' => [
                'lang' => 'painless',
                'source' => "(doc['location'].arcDistance(params.lat,params.lon) * 0.000621371) <  doc['max_delivery_distance'].value",
                'params' => [
                    'lat' => $lat,
                    'lon' => $lon,
                ],
            ],
        ];

        return $this;
    }

    /**
     * @param $dealId
     * @return array
     */
    public function get()
    {
        //$this->query['size'] = 1;
        return Deal::searchRaw($this->query);
    }
}

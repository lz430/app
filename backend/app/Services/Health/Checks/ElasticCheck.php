<?php

namespace App\Services\Health\Checks;

use App\Services\Health\HealthCheck;
use App\Services\Search\ModelYearSearch;
use GuzzleHttp\Exception\ClientException;
use App\Transformers\ESResponseTransformer;
use League\Fractal\Serializer\ArraySerializer;

class ElasticCheck extends HealthCheck
{
    /** @test **/
    public function run()
    {
        $latitude = 42.5028;
        $longitude = -83.7694;
        $filters = [];

        $query = new ModelYearSearch();

        $query = $query
            ->addFeatureAggs()
            ->addMakeAndStyleAgg()
            ->filterMustGenericRules();

        $query = $query->filterMustLocation(['lat' => $latitude, 'lon' => $longitude]);

        $query = $query->genericFilters($filters);

        $results = $query->get();

        $returnSearch = fractal()
            ->item(['response' => $results,
                'meta' => [
                    'entity' => 'model',
                ], ])
            ->transformWith(ESResponseTransformer::class)
            ->serializeWith(new ArraySerializer)
            ->respond();

        try {
            if ($returnSearch) {
                return 'OKAY!';
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}

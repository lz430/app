<?php

namespace App\Services\Search;

use Illuminate\Database\Eloquent\Collection;
use ScoutElastic\Indexers\SingleIndexer;
use Elasticsearch\Common\Exceptions\Missing404Exception;
use ScoutElastic\Payloads\DocumentPayload;
use ScoutElastic\Facades\ElasticClient;


class CustomIndexer extends SingleIndexer
{

    public function delete(Collection $models)
    {
        $models->each(function ($model) {
            $payload = (new DocumentPayload($model))
                ->get();

            try {
                ElasticClient::delete($payload);
            } catch (Missing404Exception $e) {
                // Bury these. Don't throw exceptions if the record already isn't in ES.
            }

        });
    }

}
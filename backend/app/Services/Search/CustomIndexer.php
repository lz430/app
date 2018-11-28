<?php

namespace App\Services\Search;

use ScoutElastic\Facades\ElasticClient;
use ScoutElastic\Indexers\SingleIndexer;
use ScoutElastic\Payloads\DocumentPayload;
use Illuminate\Database\Eloquent\Collection;
use Elasticsearch\Common\Exceptions\Missing404Exception;

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

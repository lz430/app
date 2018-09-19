<?php

namespace App\Http\Controllers\API;

use App\Services\Search\SuggestSearch;
use App\Transformers\SearchSuggestTransformer;
use Illuminate\Http\Request;
use App\Transformers\ESResponseTransformer;
use League\Fractal\Serializer\ArraySerializer;

class SearchController extends BaseAPIController
{
    public function index(Request $request)
    {
        $this->validate($request, [
            'query' => 'required|string',
        ]);

        $query = new SuggestSearch();

        $query = $query->setSuggestQuery($request->get('query'));
        $results = $query->get();
        return fractal()
            ->item($results)
            ->transformWith(SearchSuggestTransformer::class)
            ->serializeWith(new ArraySerializer)
            ->respond();
    }
}

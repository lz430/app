<?php

namespace App\Http\Controllers\API;

use App\Transformers\DealTransformer;
use App\VersionDeal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends BaseAPIController
{
    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';
    
    public function index(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_types' => 'sometimes|required|array',
            'sort' => 'string',
        ]);
        
        $sortParams = collect(explode(',', $request->get('sort')))->reduce(function ($columns, $item) {
            $minus = strpos($item, '-') === 0;
            $column = $minus ? substr($item, 1) : $item;
            $columns[$column] = $minus ? 'desc' : 'asc';
            return $columns;
        }, []);

        $dealsQuery = VersionDeal::whereHas('version', function (Builder $query) {
            if (request()->has('body_styles')) {
                $query->whereIn(
                    DB::raw('lower(body_style)'),
                    array_map('strtolower', request('body_styles'))
                );
            }

            $query->whereHas('model', function (Builder $query) {
                if (request()->has('make_ids')) {
                    $query->whereIn('make_id', request('make_ids'));
                }
            });
        });

        $dealsQueryCopy = clone $dealsQuery;

        if (request()->has('fuel_types')) {
            $dealsQuery->whereIn(
                DB::raw('lower(fuel)'),
                array_map('strtolower', request('fuel_types'))
            );
        }

        foreach ($sortParams as $column => $ascDesc) {
            $dealsQuery->orderBy($column, $ascDesc);
        }

        $deals = $dealsQuery->paginate(15);
        
        if (in_array('photos', $request->get('includes', []))) {
            $deals->load('photos');
        }
        
        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new IlluminatePaginatorAdapter($deals))
            ->parseIncludes($request->get('includes', []))
            ->addMeta(['fuelTypes' => $dealsQueryCopy->groupBy('fuel')->pluck('fuel')])
            ->respond();
    }
}

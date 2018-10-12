<?php

namespace DeliverMyRide\JsonApi;

use Illuminate\Database\Eloquent\Builder;

class Sort
{
    public static function sortQuery(Builder $query, string $sortParam) : Builder
    {
        $sortParams = collect(explode(',', $sortParam))->reduce(function ($columns, $item) {
            $minus = strpos($item, '-') === 0;
            $column = $minus ? substr($item, 1) : $item;
            $columns[$column] = $minus ? 'desc' : 'asc';
            return $columns;
        }, []);

        foreach ($sortParams as $column => $ascDesc) {
            $query->orderBy($column, $ascDesc);
        }

        return $query;
    }
}

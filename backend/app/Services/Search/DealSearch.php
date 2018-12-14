<?php

namespace App\Services\Search;

class DealSearch extends BaseSearch
{
    public function sort(string $sort, string $modifier = null)
    {
        list($sort, $direction) = $this->getSort($sort, $modifier);

        $this->query['sort'] = [
            [
                $sort => $direction,
            ],
        ];

        return $this;
    }
}

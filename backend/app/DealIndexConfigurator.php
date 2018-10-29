<?php

namespace App;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class DealIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    /**
     * @var array
     */
    protected $settings = [
        "analysis" => [
            "filter" => [
                "ngram_filter" => [
                    "type" => "ngram",
                    "min_gram" => 3,
                    "max_gram" => 20
                ]
            ],
            "analyzer" => [
                "ngram_analyzer" => [
                    "type" => "custom",
                    "tokenizer" => "standard",
                    "filter" => [
                        "lowercase",
                        "ngram_filter"
                    ]
                ]
            ]
        ]
    ];
}
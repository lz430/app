<?php

namespace App\Providers;

use InvalidArgumentException;
use ScoutElastic\ElasticEngine;
use Laravel\Scout\EngineManager;
use ScoutElastic\Console\ElasticMigrateCommand;
use ScoutElastic\Console\SearchRuleMakeCommand;
use ScoutElastic\Console\ElasticIndexDropCommand;
use ScoutElastic\Console\ElasticIndexCreateCommand;
use ScoutElastic\Console\ElasticIndexUpdateCommand;
use ScoutElastic\Console\SearchableModelMakeCommand;
use ScoutElastic\Console\ElasticUpdateMappingCommand;
use ScoutElastic\Console\IndexConfiguratorMakeCommand;
use ScoutElastic\ScoutElasticServiceProvider as BaseProvider;

class ScoutElasticServiceProvider extends BaseProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__.'/../config/scout_elastic.php' => config_path('scout_elastic.php'),
        ]);
        $this->commands([
            // make commands
            IndexConfiguratorMakeCommand::class,
            SearchableModelMakeCommand::class,
            SearchRuleMakeCommand::class,
            // elastic commands
            ElasticIndexCreateCommand::class,
            ElasticIndexUpdateCommand::class,
            ElasticIndexDropCommand::class,
            ElasticUpdateMappingCommand::class,
            ElasticMigrateCommand::class,
        ]);
        $this
            ->app
            ->make(EngineManager::class)
            ->extend('elastic', function () {
                $indexerType = config('scout_elastic.indexer', 'single');
                $updateMapping = config('scout_elastic.update_mapping', true);
                $indexerClass = '\\App\\Services\\Search\\CustomIndexer';
                if (! class_exists($indexerClass)) {
                    throw new InvalidArgumentException(sprintf(
                        'The %s indexer doesn\'t exist.',
                        $indexerType
                    ));
                }

                return new ElasticEngine(new $indexerClass(), $updateMapping);
            });
    }
}

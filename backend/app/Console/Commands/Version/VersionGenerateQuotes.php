<?php

namespace App\Console\Commands\Version;

use App\Models\Deal;
use App\Models\JATO\Version;
use Illuminate\Console\Command;
use App\Models\JATO\VersionQuote;
use DeliverMyRide\RIS\Manager\VersionToVehicle;

class VersionGenerateQuotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:quote {filter?  : option filter. deal:5 or make:Ford}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate all version quotes';

    private $manager;

    /**
     * Create a new command instance.
     * @param VersionToVehicle $manager
     * @return void
     */
    public function __construct(VersionToVehicle $manager)
    {
        parent::__construct();
        $this->manager = $manager;
    }

    /**
     * @param $dealId
     * @return \Illuminate\Support\Collection
     */
    private function getSingleVersion($dealId)
    {
        $deal = Deal::where('id', $dealId)->first();

        return collect([$deal->version]);
    }

    /**
     * @return Version[]|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    private function getAllVersions()
    {
        return [Version::has('deals')->orderBy('year', 'desc')];
    }

    private function getOutdatedVersions()
    {
        $hashcodes = $this->manager->fetchMakeHashcodes(true);
        $hashcodes = $hashcodes->pluck('hashcode')->toArray();

        //
        // TODO: anyway to merge these two queries together?
        $versionsWithOutdated = Version
            ::has('deals')
            ->whereHas('quotes', function ($q) use ($hashcodes) {
                $q->whereNotIn('make_hashcode', $hashcodes);
            })
            ->orderBy('year', 'desc');

        $versionsWithNone = Version
            ::has('deals')
            ->whereDoesntHave('quotes')
            ->orderBy('year', 'desc');

        return [$versionsWithOutdated, $versionsWithNone];
    }

    /**
     * @param $name
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    private function getVersionsByMakeName($name)
    {
        $query = Version::query();
        $query = $query->whereHas('model', function ($query) use ($name) {
            $query->whereHas('make', function ($query) use ($name) {
                $query->where('name', '=', $name);
            });
        });

        return $query->get();
    }

    private function getVersions($filter)
    {
        if (! $filter) {
            return $this->getOutdatedVersions();
        }

        if ($filter === 'all') {
            return $this->getAllVersions();
        }

        $filter = explode(':', $filter);
        if (count($filter) === 2 && in_array($filter[0], ['deal', 'make'])) {
            switch ($filter[0]) {
                case 'deal':
                    return $this->getSingleVersion($filter[1]);
                    break;
                case 'make':
                    return $this->getVersionsByMakeName($filter[1]);
                    break;
            }
        }

        return collect([]);
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        \DB::connection()->disableQueryLog();

        $manager = $this->manager;
        $filter = $this->argument('filter');
        foreach ($this->getVersions($filter) as $versionQuery) {
            $versionQuery->chunk(50, function ($versions) use ($manager, $filter) {
                foreach ($versions as $version) {
                    /* @var \App\Models\JATO\Version $version */

                    $quoteData = $manager->get($version);
                    $this->info($version->title());
                    if ($filter) {
                        foreach ($quoteData as $strategy => $info) {
                            $this->info($strategy);
                            $rows = [];
                            if ($info) {
                                foreach ($info as $key => $value) {
                                    if ($key != 'data') {
                                        $rows[] = [
                                            $key,
                                            $value,
                                        ];
                                    }
                                }
                                $this->table([], $rows);
                            } else {
                                $this->info(' -- No results');
                            }
                        }
                    }
                    foreach ($quoteData as $strategy => $data) {
                        if (! $data) {
                            $version->quotes()->where('strategy', $strategy)->delete();
                        } else {
                            VersionQuote::updateOrCreate([
                                'strategy' => $strategy,
                                'version_id' => $version->id,
                            ], [
                                'hashcode' => $data->hashcode,
                                'make_hashcode' => $data->makeHashcode,
                                'rate' => (float) $data->rate,
                                'term' => (int) $data->term,
                                'rebate' => (int) $data->rebate,
                                'residual' => (int) $data->residual,
                                'miles' => (int) $data->miles,
                                'rate_type' => $data->rateType,
                                'data' => $data->data,
                            ]);
                        }
                    }
                }
            });
        }
    }
}

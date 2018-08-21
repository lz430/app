<?php

namespace App\Console\Commands;

use App\Models\Deal;
use App\Models\JATO\VersionQuote;
use DeliverMyRide\RIS\Manager\VersionToVehicle;
use DeliverMyRide\RIS\RISClient;
use App\Models\JATO\Version;

use Illuminate\Console\Command;


class VersionGenerateQuotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:quote {deal?}  {--all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate all version quotes';

    /* @var RISClient */
    private $client;

    /**
     * Create a new command instance.
     * @param RISClient $client
     * @return void
     */
    public function __construct(RISClient $client)
    {
        parent::__construct();
        $this->client = $client;
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


    private function getAllVersions()
    {
        return Version::has('deals')->orderBy('year', 'desc')->get();
    }

    /**
     *
     */
    private function getOutdatedVersions()
    {
        $hashcodes = (new VersionToVehicle($this->client))->fetchMakeHashcodes(true);
        $hashcodes = $hashcodes->pluck('hashcode')->toArray();

        //
        // TODO: anyway to merge these two queries together?
        $versionsWithOutdated = Version
            ::has('deals')
            ->whereHas('quotes', function ($q) use ($hashcodes) {
                $q->whereNotIn('make_hashcode', $hashcodes);
            })
            ->orderBy('year', 'desc')
            ->get();

        $versionsWithNone = Version
            ::has('deals')
            ->whereDoesntHave('quotes')
            ->orderBy('year', 'desc')
            ->get();

        return $versionsWithOutdated->merge($versionsWithNone);
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $client = $this->client;
        $dealId = $this->argument('deal');
        $all = $this->option('all');

        if ($dealId) {
            $versions = $this->getSingleVersion($dealId);
        } elseif ($all) {
            $versions = $this->getAllVersions();
        } else {
            $versions = $this->getOutdatedVersions();
        }

        $versions->map(function ($version) use ($dealId, $client) {
            /* @var \App\Models\JATO\Version $version */

            $quoteData = (new VersionToVehicle($client))->get($version);
            $this->info($version->title());
            if ($dealId) {
                foreach ($quoteData as $strategy => $info) {
                    $this->info($strategy);
                    $rows = [];
                    if ($info) {
                        foreach ($info as $key => $value) {
                            if ($key != 'data') {
                                $rows[] = [
                                    $key,
                                    $value
                                ];
                            }
                        }
                        $this->table([], $rows);
                    } else {
                        $this->info(" -- No results");
                    }
                }
            }
            foreach ($quoteData as $strategy => $data) {
                if (!$data) {
                    $version->quotes()->where('strategy', $strategy)->delete();
                } else {
                    VersionQuote::updateOrCreate([
                        'strategy' => $strategy,
                        'version_id' => $version->id,
                    ], [
                        'hashcode' => $data->hashcode,
                        'make_hashcode' => $data->makeHashcode,
                        'rate' => (float)$data->rate,
                        'term' => (int)$data->term,
                        'rebate' => (int)$data->rebate,
                        'residual' => (int)$data->residual,
                        'miles' => (int)$data->miles,
                        'rate_type' => $data->rateType,
                        'data' => $data->data,
                    ]);
                }
            }
        });
    }
}

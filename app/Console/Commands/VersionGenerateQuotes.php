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
    protected $signature = 'dmr:version:quote {deal?}';

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
     * Execute the console command.
     */
    public function handle()
    {
        $client = $this->client;
        $dealId = $this->argument('deal');

        if ($dealId) {
            $deal = Deal::where('id', $dealId)->get()->first();
            $versions = collect([$deal->version]);
        } else {
            $versions = Version::has('deals')->orderBy('year', 'desc')->get();
        }

        $versions->map(function ($version) use ($client) {
            $datas = (new VersionToVehicle($version, '48116', $client))->get();
            $this->info($version->title());

            foreach ($datas as $strategy => $data) {
                if (!$data) {
                    continue;
                }
                VersionQuote::updateOrCreate([
                    'strategy' => $strategy,
                    'version_id' => $version->id,
                ], [
                    'hashcode' => $data->hashcode,
                    'make_hashcode' => $data->makeHashcode,
                    'rate' => (float) $data->rate,
                    'term' => (int) $data->term,
                    'rebate' => (int) $data->rebates,
                    'residual' => (int) $data->residual,
                    'miles' => (int) $data->miles,
                    'rate_type' => $data->rateType,
                    'data' => $data->data,
                ]);
            }
        });
    }
}

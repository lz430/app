<?php

namespace App\Console\Commands;

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
    protected $signature = 'dmr:version:quote';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fill Missing Photos';

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
        $versions = Version::has('deals')->doesntHave('quotes')->orderBy('year', 'desc')->get();
        $client = $this->client;
        $versions->map(function ($version) use ($client) {
            $datas = (new VersionToVehicle($version, '48116', $client))->get();
            $this->info($version->title());

            foreach ($datas as $strategy => $data) {
                if (!$data) {
                    continue;
                }

                $versionQuote = VersionQuote::updateOrCreate([
                    'strategy' => $strategy,
                    'version_id' => $version->id,
                ], [
                    'hashcode' => $data->hashcode,
                    'make_hashcode' => $data->makeHashcode,
                    'rate' => $data->rate,
                    'term' => $data->term,
                    'rebate' => $data->rebates,
                    'residual' => $data->residual,
                    'miles' => $data->miles,
                    'rate_type' => $data->rateType,
                    'data' => $data->data,
                ]);
            }
        });
    }
}

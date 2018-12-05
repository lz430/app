<?php

namespace App\Console\Commands\Version;

use Illuminate\Console\Command;
use App\Models\JATO\Version;
use App\Models\Equipment;
use App\Models\Option;
use Illuminate\Support\Facades\DB;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

class VersionPopulateEquipmentAndOptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:equipment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /** @var \DeliverMyRide\JATO\JatoClient */
    protected $client;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(JatoClient $client)
    {
        parent::__construct();
        $this->client = $client;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $data = Version::query();
        $versions = $data->whereHas('deals', function ($query) {
            $query->where('status', 'available');
        })
        ->get();

        foreach($versions as $version) {
            // Removes the command failure if jato return 400 error
            try {
                $getEquipment = collect($this->client->equipment->get($version->jato_vehicle_id)->results);
                $getOptions = collect($this->client->option->get($version->jato_vehicle_id)->options);
            } catch (ClientException | ServerException $e) {
                if($e->getCode() === 400) {
                    continue;
                }
            }

            $foundEquipment = $getEquipment
                ->reject(function ($equipment){
                    return ! in_array($equipment->availability, ['standard', 'optional']);
                });

            $foundOptions = $getOptions
                ->reject(function ($options){
                    return ! in_array($options->optionType, ['O', 'P']);
                });

            foreach($foundEquipment as $e) {
                $data = [
                    'version_id' => $version->id,
                    'option_id' => $e->optionId,
                    'schema_id' => $e->schemaId,
                    'category_id' =>$e->categoryId,
                    'category' => $e->category,
                    'name' => $e->name,
                    'location' => $e->location,
                    'availability' => $e->availability,
                    'value' => $e->value,
                    'attributes' => json_encode($e->attributes),
                ];
                Equipment::updateOrCreate($data);
            }

            foreach($foundOptions as $o) {
                $data = [
                    'version_id' => $version->id,
                    'option_id' => $o->optionId,
                    'option_code' => $o->optionCode,
                    'option_type' => $o->optionType,
                    'msrp' => $o->msrp,
                    'invoice_price' => $o->invoicePrice,
                    'option_name' => $o->optionName,
                    'option_state_name' => $o->optionStateTranslation,
                    'option_state' => $o->optionState,
                    'option_description' => $o->optionDescription,
                ];
                Option::updateOrCreate($data);
            }

            $this->info("Populating equipment/options for " . $version->title());
        }
    }
}

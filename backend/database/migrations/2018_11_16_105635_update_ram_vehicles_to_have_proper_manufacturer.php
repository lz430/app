<?php

use Illuminate\Database\Migrations\Migration;

class UpdateRamVehiclesToHaveProperManufacturer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $deals = \App\Models\Deal::select('version_id')->where('make', 'Ram')->groupBy('version_id')->get();
        $ids = [];
        foreach ($deals as $d) {
            $ids[] = $d->version_id;
        }

        $versions = \App\Models\JATO\Version::select('model_id')->whereIn('id', $ids)->groupBy('model_id')->get();
        foreach ($versions as $v) {
            DB::table('vehicle_models')
                ->where('id', $v->model_id)
                ->update(
                    [
                        'make_id' => 18,
                    ]
                );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

<?php

use Illuminate\Database\Migrations\Migration;

class PopulateMissingSeatingCapacityValues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $deals = \App\Models\Deal::where('status', 'available')->whereNull('seating_capacity')->get();

        foreach ($deals as $deal) {
            $equipmentOnDeal = $deal->getEquipment();
            $seatingCategory = $equipmentOnDeal
                ->filter(function ($equipment) {
                    return $equipment->schema_id == 701;
                })
                ->first();

            if ($seatingCategory && isset($seatingCategory->aspects)) {
                $seatingCapacity = collect($seatingCategory->aspects);

                $capacity = $seatingCapacity
                    ->filter(function ($attribute) {
                        return $attribute->name == 'Seating capacity';
                    })
                    ->pluck('value')
                    ->first();

                DB::table('deals')->where('version_id', $deal->version_id)->update(['seating_capacity' => $capacity]);
            }
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

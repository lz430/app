<?php

use App\DmrCategory;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDmrCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmr_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->string('select_one_dmr_feature')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        collect([
            [
                'title' => 'Fuel Type',
                'slug' => 'fuel_type',
                'display_order' => 1,
                'select_one_dmr_feature' => true,
            ],
            [
                'title' => 'Transmission',
                'slug' => 'transmission',
                'display_order' => 2,
            ],
            [
                'title' => 'Comfort & Convenience',
                'slug' => 'comfort_and_convenience',
                'display_order' => 3,
            ],
            [
                'title' => 'Seating',
                'slug' => 'seating',
                'display_order' => 4,
            ],
            [
                'title' => 'Infotainment',
                'slug' => 'infotainment',
                'display_order' => 5,
            ],
            [
                'title' => 'Interior',
                'slug' => 'interior',
                'display_order' => 6,
            ],
            [
                'title' => 'Exterior',
                'slug' => 'exterior',
                'display_order' => 7,
            ],
            [
                'title' => 'Safety & Driver Assist',
                'slug' => 'safety_and_driver_assist',
                'display_order' => 8,
            ],
        ])->each(function ($category) {
            DmrCategory::create($category);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dmr_categories');
    }
}

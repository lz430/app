<?php

use App\Category;
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
            $table->string('has_custom_jato_mapping')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        collect([
            [
                'title' => 'Vehicle Segment',
                'slug' => 'vehicle_segment',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Fuel Type',
                'slug' => 'fuel_type',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Transmission',
                'slug' => 'transmission',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Drive Train',
                'slug' => 'drive_train',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Comfort & Convenience',
                'slug' => 'comfort_and_convenience',
            ],
            [
                'title' => 'Seating',
                'slug' => 'seating',
            ],
            [
                'title' => 'Seat Materials',
                'slug' => 'seat_materials',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Seating Configuration',
                'slug' => 'seating_configuration',
                'has_custom_jato_mapping' => true,
            ],
            [
                'title' => 'Infotainment',
                'slug' => 'infotainment',
            ],
            [
                'title' => 'Interior',
                'slug' => 'interior',
            ],
            [
                'title' => 'Safety & Driver Assist',
                'slug' => 'safety_and_driver_assist',
            ],
            [
                'title' => 'Exterior',
                'slug' => 'exterior',
            ],
            [
                'title' => 'Pickup',
                'slug' => 'pickup',
                'has_custom_jato_mapping' => true,
            ],
        ])->each(function ($category, $key) {
            $category['display_order'] = $key + 1;

            Category::make($category)->setTable('dmr_categories')->save();
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

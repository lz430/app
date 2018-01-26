<?php

use App\DmrCategory;
use App\DmrFeature;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDmrFeaturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmr_features', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->integer('dmr_category_id');
            $table->json('jato_schema_ids')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        collect([
            'vehicle_segment' => [
                [
                    'title' => 'Subcompact',
                    'slug' => 'subcompact',
                    'jato_schema_ids' => [176],
                ],
                [
                    'title' => 'Compact',
                    'slug' => 'compact',
                    'jato_schema_ids' => [176],
                ],
                [
                    'title' => 'Mid-size',
                    'slug' => 'mid-size',
                    'jato_schema_ids' => [176],
                ],
                [
                    'title' => 'Full-size',
                    'slug' => 'full-size',
                    'jato_schema_ids' => [176],
                ],
                [
                    'title' => 'Mini Van',
                    'slug' => 'minivan',
                    'jato_schema_ids' => [176],
                ],
                [
                    'title' => 'Sports',
                    'slug' => 'sports',
                    'jato_schema_ids' => [176],
                ],
            ],
            'comfort_and_convenience' => [
                [
                    'title' => 'Automatic trunk/hatch closing',
                    'slug' => 'automatic_trunk_hatch_closing',
                    'jato_schema_ids' => [4101],
                ],
                [
                    'title' => 'Automatic side door closing',
                    'slug' => 'automatic_side_door_closing',
                    'jato_schema_ids' => [43504],
                ],
                [
                    'title' => 'Adaptive cruise control',
                    'slug' => 'adaptive_cruise_control',
                    'jato_schema_ids' => [4503],
                ],
                [
                    'title' => 'Rear climate control',
                    'slug' => 'rear_climate_control',
                    'jato_schema_ids' => [21005],
                ],
                [
                    'title' => 'Remote Start',
                    'slug' => 'remote_start',
                    'jato_schema_ids' => [37501, 33401],
                ],
                [
                    'title' => 'Keyless Entry',
                    'slug' => 'keyless_entry',
                    'jato_schema_ids' => [14802],
                ],
                [
                    'title' => 'Sunroof',
                    'slug' => 'sunroof',
                    'jato_schema_ids' => [15601],
                ],
                [
                    'title' => 'Power adjustable steering wheel',
                    'slug' => 'power_adjustable_steering_wheel',
                    'jato_schema_ids' => [18408, 18406, 18407, 18411, 18410],
                ],
                [
                    'title' => 'Heated steering wheel',
                    'slug' => 'heated_steering_wheel',
                    'jato_schema_ids' => [18409],
                ]
            ],
            'seating' => [
                [
                    'title' => 'Power adjustable front seats (driver / passenger)',
                    'slug' => 'power_adjustable_front_seats_driver_passenger',
                    'jato_schema_ids' => [17812],
                ],
                [
                    'title' => 'Heated front seats (driver / passenger)',
                    'slug' => 'heated_front_seats_driver_passenger',
                    'jato_schema_ids' => [17811],
                ],
                [
                    'title' => 'Climate controlled front seats (driver / passenger)',
                    'slug' => 'climate_controlled_seats_driver_passenger',
                    'jato_schema_ids' => [17819, 17823],
                ],
                [
                    'title' => 'Heated rear seats',
                    'slug' => 'heated_rear_seats',
                    'jato_schema_ids' => [17909],
                ],
                [
                    'title' => 'Folding rear seat',
                    'slug' => 'folding_rear_seat',
                    'jato_schema_ids' => [17912],
                ],
                [
                    'title' => 'Booster seats (rear / third row)',
                    'slug' => 'booster_seats_rear_third_row',
                    'jato_schema_ids' => [57402],
                ],
            ],
            'seat_materials' => [
                [
                    'title' => 'Cloth',
                    'slug' => 'seat_main_upholstery_cloth',
                    'jato_schema_ids' => [17402],
                ],
                [
                    'title' => 'Leather',
                    'slug' => 'seat_main_upholstery_leather',
                    'jato_schema_ids' => [17402],
                ],
                [
                    'title' => 'Suede',
                    'slug' => 'seat_main_upholstery_suede',
                    'jato_schema_ids' => [17402],
                ],
                [
                    'title' => 'Vinyl',
                    'slug' => 'seat_main_upholstery_vinyl',
                    'jato_schema_ids' => [17402],
                ],
            ],
            'seating_configuration' => [
                [
                    'title' => 'Second row bench',
                    'slug' => 'second_row_bench',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => 'Second row captains chairs',
                    'slug' => 'second_row_captains_chairs',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => '3rd row seating',
                    'slug' => 'third_row_seating',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => '4th row seating',
                    'slug' => 'fourth_row_seating',
                    'jato_schema_ids' => [701],
                ],
            ],
            'pickup' => [
                [
                    'title' => 'regular cab',
                    'slug' => 'regular_cab',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => 'extended cab',
                    'slug' => 'extended_cab',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => 'crew cab',
                    'slug' => 'crew_cab',
                    'jato_schema_ids' => [701],
                ],
                [
                    'title' => '2 Door',
                    'slug' => 'pickup_doors_2',
                    'jato_schema_ids' => [601],
                ],
                [
                    'title' => '4 Door',
                    'slug' => 'pickup_doors_4',
                    'jato_schema_ids' => [601],
                ],
            ],
            'fuel_type' => [
                [
                    'title' => 'Gas',
                    'slug' => 'fuel_type_gas',
                    'jato_schema_ids' => [7403, 8702],
                ],
                [
                    'title' => 'Diesel',
                    'slug' => 'fuel_type_diesel',
                    'jato_schema_ids' => [7403, 8702],
                ],
                [
                    'title' => 'Hybrid & Electric',
                    'slug' => 'fuel_type_hybrid_electric',
                    'jato_schema_ids' => [51801, 51901],
                ],
            ],
            'exterior' => [
                [
                    'title' => 'Roof rails',
                    'slug' => 'roof_rails',
                    'jato_schema_ids' => [15701],
                ],
            ],
            'infotainment' => [
                [
                    'title' => 'Navigation system',
                    'slug' => 'navigation_system',
                    'jato_schema_ids' => [25201, 25206, 25209, 25204, 56101],
                ],
                [
                    'title' => 'Wireless charging pad',
                    'slug' => 'wireless_charging_pad',
                    'jato_schema_ids' => [55801],
                ],
                [
                    'title' => 'Bluetooth',
                    'slug' => 'bluetooth',
                    'jato_schema_ids' => [44803, 44804],
                ],
                [
                    'title' => 'Rear entertainment display (middle / back of front seats)',
                    'slug' => 'rear_entertainment_display_middle_back_of_front_seats',
                    'jato_schema_ids' => [327702],
                ],
                [
                    'title' => 'Wifi network',
                    'slug' => 'wifi_network',
                    'jato_schema_ids' => [53201],
                ],
                [
                    'title' => 'CD Player',
                    'slug' => 'cd_player',
                    'jato_schema_ids' => [1332, 1304, 41001],
                ],
                [
                    'title' => 'Satellite radio',
                    'slug' => 'satellite_radio',
                    'jato_schema_ids' => [1329, 1330],
                ],
                [
                    'title' => 'Wireless headphones',
                    'slug' => 'wireless_headphones',
                    'jato_schema_ids' => [1331],
                ],
                [
                    'title' => 'USB connection (front / rear)',
                    'slug' => 'usb_connection_front_rear',
                    'jato_schema_ids' => [46907, 46910],
                ],
                [
                    'title' => 'Android Auto mobile integration',
                    'slug' => 'android_auto_mobile_integration',
                    'jato_schema_ids' => [59803],
                ],
                [
                    'title' => 'Apple CarPlay mobile integration',
                    'slug' => 'apple_carplay_mobile_integration',
                    'jato_schema_ids' => [59802],
                ],
            ],
            'interior' => [
                [
                    'title' => 'Overhead console storage',
                    'slug' => 'overhead_console_storage',
                    'jato_schema_ids' => [26604],
                ],
                [
                    'title' => 'Sunroof',
                    'slug' => 'sunroof',
                    'jato_schema_ids' => [15602],
                ],
                [
                    'title' => 'Cupholders (front / rear)',
                    'slug' => 'cupholders_front_rear',
                    'jato_schema_ids' => [19602],
                ],
                [
                    'title' => 'Ashtray (front / rear)',
                    'slug' => 'ashtray_front_rear',
                    'jato_schema_ids' => [4802],
                ],
            ],
            'safety_and_driver_assist' => [
                [
                    'title' => 'Trailer hitch',
                    'slug' => 'trailer_hitch',
                    'jato_schema_ids' => [1602, 53103, 53105],
                ],
                [
                    'title' => 'Anti-lock Breaking System (ABS)',
                    'slug' => 'antilock_breaking_system',
                    'jato_schema_ids' => [3201],
                ],
                [
                    'title' => 'Collision Warning System',
                    'slug' => 'collision_warning_system',
                    'jato_schema_ids' => [41401, 44101, 44107, 44102, 44103, 44109, 57301, 46201, 46202, 46203, 61401],
                ],
                [
                    'title' => 'Park Assist Sensors',
                    'slug' => 'park_assist_sensors',
                    'jato_schema_ids' => [5601, 49401, 5601],
                ],
                [
                    'title' => 'Backup Camera',
                    'slug' => 'backup_camera',
                    'jato_schema_ids' => [53001, 21504],
                ],
                [
                    'title' => 'Trailer hitch',
                    'slug' => 'trailer_hitch',
                    'jato_schema_ids' => [53101, 53102],
                ],
                [
                    'title' => 'Anti-theft protection',
                    'slug' => 'anti_theft_protection',
                    'jato_schema_ids' => [14901],
                ],
                [
                    'title' => 'Side airbags',
                    'slug' => 'side_airbags',
                    'jato_schema_ids' => [16401, 13801],
                ],
                [
                    'title' => 'Heads Up Odometer Display',
                    'slug' => 'heads_up_odometer_display',
                    'jato_schema_ids' => [9003],
                ],
            ],
            'transmission' => [
                [
                    'title' => 'Automatic',
                    'slug' => 'transmission_automatic',
                    'jato_schema_ids' => [20602],
                ],
                [
                    'title' => 'Manual',
                    'slug' => 'transmission_manual',
                    'jato_schema_ids' => [20602],
                ],
            ],
            'drive_train' => [
                [
                    'title' => 'Front Wheel Drive',
                    'slug' => 'drive_train_fwd',
                    'jato_schema_ids' => [6502],
                ],
                [
                    'title' => 'Rear Wheel Drive',
                    'slug' => 'drive_train_rwd',
                    'jato_schema_ids' => [6502],
                ],
                [
                    'title' => '4x4 (Four Wheel Drive)',
                    'slug' => 'drive_train_4wd',
                    'jato_schema_ids' => [6502],
                ],
                [
                    'title' => 'All Wheel Drive',
                    'slug' => 'drive_train_awd',
                    'jato_schema_ids' => [6502],
                ],
            ]
        ])->each(function ($features, $categorySlug){
            $categoryId = DmrCategory::where('slug', $categorySlug)->first()->id;

            $count = 1;

            collect($features)->each(function ($feature) use ($categoryId, &$count) {
                $feature['dmr_category_id'] = $categoryId;
                $feature['display_order'] = $count;

                DmrFeature::create($feature);
                $count++;
            });

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dmr_features');
    }
}

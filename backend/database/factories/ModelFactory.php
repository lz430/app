<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use Carbon\Carbon;
use App\Models\Feature;
use App\Models\Category;
use App\Models\JatoFeature;
use Illuminate\Support\Facades\Hash;

$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'email' => $faker->unique()->safeEmail,
        'phone_number' => $faker->phoneNumber,
        'password' => Hash::make('myfakepassword'),
        'remember_token' => str_random(10),
        'drivers_license_number' => str_random(10),
        'drivers_license_state' => str_random(2),
    ];
});

$factory->define(App\Models\UserPasswordReset::class, function (Faker\Generator $faker) {
    return [
        'email' => $faker->unique()->safeEmail,
        'token' => str_random(10),
    ];
});

$factory->define(App\Models\JATO\Manufacturer::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
    ];
});

$factory->define(App\Models\JATO\Make::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
        'manufacturer_id' => factory(App\Models\JATO\Manufacturer::class),
    ];
});

$factory->define(App\Models\JATO\VehicleModel::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
        'make_id' => factory(App\Models\JATO\Make::class),
    ];
});

$factory->define(App\Models\JATO\Version::class, function (Faker\Generator $faker) {
    return [
        'jato_vehicle_id' => $faker->unique()->randomNumber(),
        'jato_uid' => $faker->unique()->randomNumber(),
        'jato_model_id' => $faker->unique()->randomNumber(),
        'model_id' => factory(App\Models\JATO\VehicleModel::class),
        'year' => $faker->year,
        'name' => $faker->name,
        'trim_name' => $faker->name,
        'description' => $faker->text(),
        'driven_wheels' => $faker->randomElement(['FWD', 'RWD']),
        'doors' => $faker->randomElement(['2', '4']),
        'transmission_type' => $faker->randomElement(['Manual', 'Automatic']),
        'msrp' => $faker->randomFloat(2, 10000, 100000),
        'invoice' => $faker->randomFloat(2, 9000, 90000),
        'body_style' => $faker->randomElement(['Pickup', 'Convertible', 'Cargo Van']),
        'fuel_econ_city' => $faker->numberBetween(10, 29),
        'fuel_econ_hwy' => $faker->numberBetween(30, 50),
        'manufacturer_code' => $faker->randomElement(['DR1H61', 'DR1S61', 'VF3L27']),
        'delivery_price' => $faker->randomFloat(2, 800, 1400),
        'is_current' => $faker->boolean(),
    ];
});

$factory->define(App\Models\Deal::class, function (Faker\Generator $faker) {
    return [
        'file_hash' => $faker->md5,
        'dealer_id' => function () {
            return factory(App\Models\Dealer::class)->create()->dealer_id;
        },
        'version_id' => function () {
            return factory(App\Models\JATO\Version::class)->create()->id;
        },
        'status' => 'available',
        'stock_number' => 'AH2844A',
        'vin' => '3C4NJDBB4HT628358',
        'new' => true,
        'year' => 2017,
        'make' => 'Jeep',
        'model' => 'Compass',
        'model_code' => 'MPJM74',
        'body' => '4D Sport Utility',
        'transmission' => 'CVT',
        'series' => 'Latitude',
        'series_detail' => null,
        'door_count' => 4,
        'odometer' => null,
        'engine' => '2.4L I4 MultiAir',
        'fuel' => 'Gasoline',
        'color' => 'White Clearcoat',
        'interior_color' => 'Ski Gray/Black',
        'price' => 27242.00,
        'msrp' => 29475.00,
        'inventory_date' => Carbon::now(),
        'certified' => false,
        'description' => '$2,509 off MSRP! Factory MSRP: $31,510 4WD, ABS brakes, Compass, Electronic Stability Control, Heated door mirrors, Illuminated entry, Low tire pressure warning, Remote keyless entry, Traction control. 2017 Jeep Compass LatitudeReviews:  * Appealing baby-Grand Cherokee styling; optional flip-down tailgate speakers make tailgating a bit more fun; above-average off-road capability with Freedom Drive II; attractively priced. Source: Edmunds   ',
        'fuel_econ_city' => 22,
        'fuel_econ_hwy' => null,
        'dealer_name' => 'Suburban Chrysler Jeep Dodge of Troy',
        'days_old' => 11,
        'option_codes' => [],
        'package_codes' => [],
        'source_price' => (object) [],
        'payments' => (object) [],
    ];
});

$factory->define(App\Models\JatoFeature::class, function (Faker\Generator $faker) {
    return [
        'feature' => $faker->unique()->randomElement(JatoFeature::WHITELIST),
        'group' => $faker->randomElement(JatoFeature::SYNC_GROUPS)['title'],
    ];
});

$factory->define(App\Models\Dealer::class, function (Faker\Generator $faker) {
    return [
        'dealer_id' => $faker->unique()->randomNumber(),
        'latitude' => $faker->latitude,
        'longitude' => $faker->longitude,
        'name' => $faker->company,
        'max_delivery_miles' => $faker->randomNumber(),
    ];
});

$factory->define(App\Models\Order\Purchase::class, function (Faker\Generator $faker) {
    return [
        'type' => 'cash',
        'deal_id' => factory(App\Models\Deal::class),
        'user_id' => factory(App\Models\User::class),
        'dmr_price' => 30000,
        'monthly_payment' => 500,
        'msrp' => 28000,
        'rebates' => (new \App\Services\Quote\Factories\FakeQuote())->get()->rebates,
        'trade' => (object) [],
    ];
});

$factory->define(App\Models\Category::class, function (Faker\Generator $faker) {
    return [
        'title' => $faker->unique()->company,
        'slug' => $faker->unique()->slug,
        'display_order' => rand(1, 200),
    ];
});

$factory->define(Feature::class, function (Faker\Generator $faker) {
    return [
        'title' => 'First Feature',
        'slug' => 'first-feature',
        'category_id' => factory(Category::class)->create(),
        'display_order' => 1,
        'jato_schema_ids' => collect([$faker->randomNumber(5), $faker->randomNumber(5)])->toJson(),
    ];
});

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

use App\Feature;
use Carbon\Carbon;

$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'phone_number' => $faker->phoneNumber,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\JATO\Manufacturer::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
    ];
});

$factory->define(App\JATO\Make::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
        'manufacturer_id' => factory(App\JATO\Manufacturer::class),
    ];
});

$factory->define(App\JATO\VehicleModel::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
        'make_id' => factory(App\JATO\Make::class),
    ];
});

$factory->define(App\JATO\Version::class, function (Faker\Generator $faker) {
    return [
        'jato_vehicle_id' => $faker->randomNumber(),
        'jato_uid' => $faker->randomNumber(),
        'jato_model_id' => $faker->randomNumber(),
        'model_id' => factory(App\JATO\VehicleModel::class),
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
        'photo_path' => $faker->randomElement([
            '/SSCUSA/RAM/PROMASTER/2017/4BU.JPG',
            '/SSCUSA/RAM/PROMASTER/2014/2BT.JPG',
            '/SSCUSA/DODGE/RAM PICKUP/2004/2PU.JPG',
        ]),
        'fuel_econ_city' => $faker->numberBetween(10, 29),
        'fuel_econ_hwy' => $faker->numberBetween(30, 50),
        'manufacturer_code' => $faker->randomElement(['DR1H61', 'DR1S61', 'VF3L27']),
        'delivery_price' => $faker->randomFloat(2, 800, 1400),
        'is_current' => $faker->boolean(),
    ];
});

$factory->define(App\JATO\VersionTaxAndDiscount::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->word,
        'amount' => $faker->randomFloat(2, -5000, 5000),
    ];
});

$factory->define(App\JATO\Option::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->colorName,
        'state' => $faker->randomElement(['Required', 'Available']),
        'description' => $faker->text(),
        'jato_option_id' => $faker->unique()->randomNumber(),
        'option_code' => $faker->text(5),
        'option_type' => $faker->randomElement(['O', 'C', 'I', 'P', 'B', 'A']),
        'msrp' => $faker->randomFloat(2, 4000, 6000),
        'invoice' => $faker->randomFloat(2, 2000, 3900),
    ];
});

$factory->define(App\Deal::class, function (Faker\Generator $faker) {
    return [
        'file_hash' => $faker->md5,
        'dealer_id' => factory(App\Dealer::class)->create()->dealer_id,
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
    ];
});

$factory->define(App\Feature::class, function (Faker\Generator $faker) {
    return [
        'feature' => $faker->unique()->randomElement(Feature::WHITELIST),
        'group' => $faker->randomElement(Feature::GROUPS),
    ];
});

$factory->define(App\Dealer::class, function (Faker\Generator $faker) {
    return [
        'dealer_id' => $faker->unique()->randomNumber(),
        'latitude' => $faker->latitude,
        'longitude' => $faker->longitude,
        'name' => $faker->company,
        'max_delivery_miles' => $faker->randomNumber(),
    ];
});

$factory->define(App\Purchase::class, function (Faker\Generator $faker) {
    return [
        'type' => 'cash',
        'deal_id' => factory(App\Deal::class),
        'user_id' => factory(App\User::class),
        'dmr_price' => 30000,
        'msrp' => 28000,
    ];
});

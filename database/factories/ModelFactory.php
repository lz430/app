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
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
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
        'manufacturer_id' => factory(App\JATO\Manufacturer::class)->create()->id
    ];
});

$factory->define(App\JATO\VehicleModel::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->unique()->company,
        'url_name' => $faker->unique()->slug,
        'is_current' => $faker->boolean(),
        'make_id' => factory(App\JATO\Make::class)->create()->id
    ];
});

$factory->define(App\JATO\Version::class, function (Faker\Generator $faker) {
    return [
        'jato_vehicle_id' => $faker->randomElement(['75644520050520', '718410620150406', '740002220150406']),
        'jato_uid' => $faker->randomNumber(),
        'jato_model_id' => $faker->randomNumber(),
        'model_id' => factory(App\JATO\VehicleModel::class)->create()->id,
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
            '/SSCUSA/DODGE/RAM PICKUP/2004/2PU.JPG'
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

$factory->define(App\JATO\VersionOption::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->colorName,
        'state' => $faker->randomElement(['Required', 'Available']),
        'description' => $faker->text(),
        'jato_option_id' => $faker->unique()->randomNumber(),
        'option_code' => $faker->text(5),
        'option_type' => $faker->randomElement(['O', 'C', 'I', 'P', 'B', 'A']),
        'msrp' => $faker->randomFloat(2, 4000, 6000),
        'invoice' => $faker->randomFloat(2, 2000, 3900)
    ];
});

$factory->define(App\SavedVehicle::class, function (Faker\Generator $faker) {
    $manufacturer = factory(App\JATO\Manufacturer::class)->create();
    $make = $manufacturer->makes()->save(factory(App\JATO\Make::class)->make());
    $model = $make->models()->save(factory(App\JATO\VehicleModel::class)->make());
    $version = $model->versions()->save(factory(App\JATO\Version::class)->make());

    return [
        'user_id' => factory(App\User::class)->create()->id,
        'version_id' => $version->id,
    ];
});

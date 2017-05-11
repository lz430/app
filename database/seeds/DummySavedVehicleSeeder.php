<?php

use App\User;
use Illuminate\Database\Seeder;

class DummySavedVehicleSeeder extends Seeder
{
    public function run()
    {
        factory(App\SavedVehicle::class, 10)->create()
            ->each(function ($savedVehicle) {
                // Add options to saved vehicle.
                /** @var \Illuminate\Support\Collection $options */
                $options = $savedVehicle->version->options()
                    ->saveMany(factory(App\JATO\VersionOption::class, 10)->make());

                $savedVehicle->options()->sync($options->take(5));

                // Add taxes and discounts to saved vehicle.
                $savedVehicle->version->taxesAndDiscounts()
                    ->saveMany(factory(App\JATO\VersionTaxAndDiscount::class, 3)->make());
            });
    }
}

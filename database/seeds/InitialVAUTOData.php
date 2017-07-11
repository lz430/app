<?php

use App\Dealer;
use Illuminate\Database\Seeder;

class InitialVAUTOData extends Seeder
{
    public function run()
    {
        Dealer::firstOrCreate([
            'dealer_id' => 'MP11392',
            'name' => 'Suburban Ford of Ferndale',
            'latitude' => 42.4511694,
            'longitude' => -83.1277241,
            'max_delivery_miles' => 5000,
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP7023',
            'name' => 'Suburban Buick GMC',
            'latitude' => 42.453317,
            'longitude' => -83.1289583,
            'max_delivery_miles' => 5000,
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP4111',
            'name' => 'Suburban Toyota',
            'latitude' => 42.5479813,
            'longitude' => -83.1790301,
            'max_delivery_miles' => 5000,
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP4164',
            'name' => 'Suburban Chrysler Jeep Dodge of Troy',
            'latitude' => 42.552988,
            'longitude' => -83.173418,
            'max_delivery_miles' => 5000,
        ]);
    }
}

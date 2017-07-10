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
    }
}

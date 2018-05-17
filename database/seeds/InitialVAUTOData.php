<?php

use App\Models\Dealer;
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
            'route_one_id' => 'CL2DI',
            'address' => '21600 Woodward Ave',
            'city' => 'Ferndale',
            'state' => 'MI',
            'zip' => '48220',
            'phone' => '(248) 399-1000',
            'contact_name' => 'Jeff Huvaere',
            'contact_title' => 'Retail Operations Manager',
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP7023',
            'name' => 'Suburban Buick GMC',
            'latitude' => 42.453317,
            'longitude' => -83.1289583,
            'route_one_id' => 'XX2OA',
            'address' => '21600 Woodward Ave',
            'city' => 'Ferndale',
            'state' => 'MI',
            'zip' => '48220',
            'phone' => '(248) 547-6100',
            'contact_name' => 'Jonathan Smith',
            'contact_title' => 'General Manager',
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP4111',
            'name' => 'Suburban Toyota',
            'latitude' => 42.5479813,
            'longitude' => -83.1790301,
            'route_one_id' => 'SY1PV',
            'address' => '2100 West Maple',
            'city' => 'Troy',
            'state' => 'MI',
            'zip' => '48084',
            'phone' => '(248) 643-8500',
            'contact_name' => 'Dennis Barrera',
            'contact_title' => 'Sales Manager',
        ]);

        Dealer::firstOrCreate([
            'dealer_id' => 'MP4164',
            'name' => 'Suburban Chrysler Jeep Dodge of Troy',
            'latitude' => 42.552988,
            'longitude' => -83.173418,
            'route_one_id' => 'KM3ZG',
            'address' => '1790 Maplelawn',
            'city' => 'Troy',
            'state' => 'MI',
            'zip' => '48084',
            'phone' => '(248) 585-8800',
            'contact_name' => 'Ben Heer',
            'contact_title' => 'Retail Operations Manager',
        ]);
    }
}

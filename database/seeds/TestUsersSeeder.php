<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Logan Henson',
            'email' => 'logan@tighten.co',
            'phone_number' => '9033606313',
            'password' => bcrypt('password'),
        ]);
    
        User::create([
            'name' => 'Jose Soto',
            'email' => 'jose@tighten.co',
            'phone_number' => '9033606313',
            'password' => bcrypt('password'),
        ]);
    }
}

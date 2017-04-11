<?php

use App\User;
use Illuminate\Database\Seeder;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Logan Henson',
            'email' => 'logan@tighten.co',
            'password' => bcrypt('password'),
        ]);
    }
}

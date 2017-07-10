<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialZipCodesData extends Seeder
{
    public function run()
    {
        DB::unprepared(file_get_contents(__DIR__ . '/zipcodes.sql'));
    }
}

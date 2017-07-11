<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialJATOData extends Seeder
{
    public function run()
    {
        DB::unprepared(file_get_contents(__DIR__ . '/jato.sql'));
    }
}

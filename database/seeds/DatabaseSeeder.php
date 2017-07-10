<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(InitialJATOData::class);
        $this->call(InitialVAUTOData::class);
        $this->call(InitialZipCodesData::class);
    }
}

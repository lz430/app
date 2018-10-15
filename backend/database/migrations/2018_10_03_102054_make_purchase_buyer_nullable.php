<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakePurchaseBuyerNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // https://stackoverflow.com/questions/33140860/laravel-5-1-unknown-database-type-enum-requested
        DB::statement('ALTER TABLE purchases MODIFY user_id int(10) unsigned;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

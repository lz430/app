<?php

use Illuminate\Database\Migrations\Migration;

class SetInitialPurchaseId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //https://laraveldaily.com/set-auto-increment-start-laravel-migrations/
        DB::statement('ALTER TABLE purchases AUTO_INCREMENT = 53145;');
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

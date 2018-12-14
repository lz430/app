<?php

use Illuminate\Database\Migrations\Migration;

class AddErrorStatusToDealsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE deals MODIFY COLUMN status ENUM('available', 'error', 'pending', 'processing', 'sold')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE deals MODIFY COLUMN status ENUM('available', 'pending', 'processing', 'sold')");
    }
}

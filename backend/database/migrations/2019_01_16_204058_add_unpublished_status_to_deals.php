<?php

use Illuminate\Database\Migrations\Migration;

class AddUnpublishedStatusToDeals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE deals MODIFY COLUMN status ENUM('available', 'error', 'pending', 'processing', 'sold', 'unpublished')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}

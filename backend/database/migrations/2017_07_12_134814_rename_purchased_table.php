<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

class RenamePurchasedTable extends Migration
{
    public function up()
    {
        Schema::rename('purchased', 'purchases');
    }

    public function down()
    {
        Schema::rename('purchases', 'purchased');
    }
}

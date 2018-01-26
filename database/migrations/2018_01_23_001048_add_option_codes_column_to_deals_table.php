<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOptionCodesColumnToDealsTable extends Migration
{
    public function up()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->json('option_codes')->after('description')->nullable();
        });
    }

    public function down()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('option_codes');
        });
    }
}

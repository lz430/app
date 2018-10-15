<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddContentColumnToFeatures extends Migration
{
    public function up()
    {
        Schema::table('features', function (Blueprint $table) {
            $table->string('content')->after('feature')->nullable();
        });
    }

    public function down()
    {
        Schema::table('features', function (Blueprint $table) {
            $table->dropColumn('content');
        });
    }
}

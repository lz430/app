<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFeatureGroupToFeaturesTable extends Migration
{
    public function up()
    {
        Schema::table('features', function (Blueprint $table) {
            $table->string('group')->after('feature')->nullable();
        });
    }

    public function down()
    {
        Schema::table('features', function (Blueprint $table) {
            $table->dropColumn('group');
        });
    }
}

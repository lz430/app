<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MoveFeaturesToVersionDealsOptions extends Migration
{
    public function up()
    {
        Schema::table('version_deals', function (Blueprint $table) {
            $table->dropColumn('features');
        });

        Schema::create('version_deal_options', function (Blueprint $table) {
            $table->increments('id');
            $table->string('option');
            $table->unsignedInteger('version_deal_id');
            $table->foreign('version_deal_id')->references('id')->on('version_deals')->onDelete('cascade');
            $table->unique(['version_deal_id', 'option']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('version_deals', function (Blueprint $table) {
            $table->longText('features')->nullable();
        });
    }
}

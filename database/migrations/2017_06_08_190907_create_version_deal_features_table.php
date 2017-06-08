<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionDealFeaturesTable extends Migration
{
    public function up()
    {
        Schema::create('feature_version_deal', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('version_deal_id');
            $table->foreign('version_deal_id')->references('id')->on('version_deals')->onDelete('cascade');
            $table->unsignedInteger('feature_id');
            $table->foreign('feature_id')->references('id')->on('features')->onDelete('cascade');
            $table->unique(['version_deal_id', 'feature_id']);
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('feature_version_deal');
    }
}

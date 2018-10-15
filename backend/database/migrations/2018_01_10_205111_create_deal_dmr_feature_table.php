<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDealDmrFeatureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deal_dmr_feature', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('deal_id');
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->unsignedInteger('dmr_feature_id');
            $table->foreign('dmr_feature_id')->references('id')->on('dmr_features')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deal_dmr_feature');
    }
}

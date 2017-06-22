<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDealsTableAndNormalizeVersionDeals extends Migration
{
    public function up()
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->increments('id');
            $table->string('file_hash');
            $table->string('dealer_id');
            $table->string('stock_number');
            $table->string('vin');
            $table->boolean('new');
            $table->string('year');
            $table->string('make');
            $table->string('model');
            $table->string('model_code');
            $table->string('body');
            $table->string('transmission');
            $table->string('series');
            $table->string('series_detail')->nullable();
            $table->string('door_count');
            $table->string('odometer')->nullable();
            $table->string('engine');
            $table->string('fuel');
            $table->string('color');
            $table->string('interior_color');
            $table->decimal('price')->nullable();
            $table->decimal('msrp')->nullable();
            $table->date('inventory_date');
            $table->boolean('certified')->nullable();
            $table->longText('description')->nullable();
            $table->integer('fuel_econ_city')->nullable();
            $table->integer('fuel_econ_hwy')->nullable();
            $table->string('dealer_name');
            $table->integer('days_old');
            $table->unique(['file_hash', 'vin']);
            $table->timestamps();
        });

        Schema::create('deal_version', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('deal_id');
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['deal_id', 'version_id']);
        });

        Schema::create('deal_photos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('deal_id');
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->string('url');
            $table->unique(['deal_id', 'url']);
            $table->timestamps();
        });

        Schema::create('deal_feature', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('deal_id');
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->unsignedInteger('feature_id');
            $table->foreign('feature_id')->references('id')->on('features')->onDelete('cascade');
            $table->unique(['deal_id', 'feature_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('deal_version');
        Schema::dropIfExists('deal_photos');
        Schema::dropIfExists('deal_feature');
        Schema::dropIfExists('deals');
    }
}

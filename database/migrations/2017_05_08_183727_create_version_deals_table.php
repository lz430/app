<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionDealsTable extends Migration
{
    public function up()
    {
        Schema::create('version_deals', function (Blueprint $table) {
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
            $table->longText('features')->nullable();
            $table->integer('fuel_econ_city')->nullable();
            $table->integer('fuel_econ_hwy')->nullable();
            $table->string('dealer_name');
            $table->integer('days_old');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['file_hash', 'dealer_id', 'stock_number', 'version_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('version_deals');
    }
}

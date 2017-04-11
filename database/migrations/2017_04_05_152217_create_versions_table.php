<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionsTable extends Migration
{
    public function up()
    {
        Schema::create('versions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('jato_vehicle_id');
            $table->unsignedBigInteger('jato_uid');
            $table->unsignedBigInteger('jato_model_id');
            $table->unique(['jato_vehicle_id', 'jato_uid', 'jato_model_id'], 'jato_model_version');
            $table->string('year');
            $table->string('name')->nullable();
            $table->string('trim_name');
            $table->string('description');
            $table->string('driven_wheels')->nullable();
            $table->unsignedInteger('doors');
            $table->string('transmission_type');
            $table->decimal('msrp', 12)->nullable();
            $table->decimal('invoice', 12)->nullable();
            $table->string('body_style');
            $table->string('photo_path');
            $table->integer('fuel_econ_city')->nullable();
            $table->integer('fuel_econ_hwy')->nullable();
            $table->string('manufacturer_code')->nullable();
            $table->decimal('delivery_price')->nullable();
            $table->boolean('is_current');
            $table->unsignedInteger('model_id');
            $table->foreign('model_id')->references('id')->on('vehicle_models')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('versions');
    }
}

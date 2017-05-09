<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSavedVehicleOptionsTable extends Migration
{
    public function up()
    {
        Schema::create('saved_vehicle_version_option', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('saved_vehicle_id');
            $table->foreign('saved_vehicle_id')->references('id')->on('saved_vehicles')->onDelete('cascade');
            $table->unsignedInteger('version_option_id');
            $table->foreign('version_option_id')->references('id')->on('version_options')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::disableForeignKeyConstraints();
        
        Schema::dropIfExists('saved_vehicle_version_option');
    }
}

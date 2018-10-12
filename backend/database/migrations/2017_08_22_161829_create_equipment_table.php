<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEquipmentTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('equipment');
        
        Schema::create('equipment', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('jato_vehicle_id');
            $table->string('name');
            $table->unique(['jato_vehicle_id', 'name']);
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('equipment');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropBuyRequestTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('buy_requests');
    }

    public function down()
    {
        Schema::create('buy_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedInteger('saved_vehicle_id');
            $table->foreign('saved_vehicle_id')->references('id')->on('saved_vehicles')->onDelete('cascade');
            $table->timestamps();
        });
    }
}

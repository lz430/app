<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchasedTable extends Migration
{
    public function up()
    {
        Schema::create('purchased', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('deal_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('deal_id')->references('id')->on('deals');
            $table->decimal('dmr_price'); // added later
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchased');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateManufacturersTable extends Migration
{
    public function up()
    {
        Schema::create('manufacturers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('url_name')->unique();
            $table->boolean('is_current');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('manufacturers');
    }
}

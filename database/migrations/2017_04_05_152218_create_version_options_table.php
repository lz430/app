<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionOptionsTable extends Migration
{
    public function up()
    {
        Schema::create('version_options', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('state');
            $table->longText('description');
            $table->unsignedBigInteger('jato_option_id');
            $table->string('option_code');
            $table->string('option_type');
            $table->decimal('msrp');
            $table->decimal('invoice');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['version_id', 'jato_option_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('version_options');
    }
}

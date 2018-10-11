<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionsTaxesAndDiscountsTable extends Migration
{
    public function up()
    {
        Schema::create('version_taxes_and_discounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->decimal('amount');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['version_id', 'name']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('version_taxes_and_discounts');
    }
}

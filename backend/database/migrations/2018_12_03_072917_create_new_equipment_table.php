<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewEquipmentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('version_id')->unsigned()->index();
            $table->foreign('version_id')->references('id')->on('versions');

            $table->integer('option_id');
            $table->integer('schema_id');
            $table->integer('category_id');
            $table->string('category');
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('availability');
            $table->string('value')->nullable();
            $table->json('attributes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('equipment');
    }
}

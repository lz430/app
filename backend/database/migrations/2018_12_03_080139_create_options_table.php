<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('version_id');
            $table->integer('option_id');
            $table->string('option_code');
            $table->string('option_type');
            $table->decimal('msrp', 8,2);
            $table->decimal('invoice_price', 8,2);
            $table->string('option_name');
            $table->string('option_state_name');
            $table->string('option_state');
            $table->text('option_description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('options');
    }
}

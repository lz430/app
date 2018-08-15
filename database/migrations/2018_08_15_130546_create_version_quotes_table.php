<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionQuotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('versions_quotes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('hashcode');
            $table->string('make_hashcode');
            $table->string('strategy');

            $table->integer('version_id')->unsigned()->index();
            $table->foreign('version_id')->references('id')->on('versions');

            $table->integer('term');
            $table->integer('rebate');
            $table->decimal('rate');

            // Lease only stuff
            $table->integer('residual')->nullable();
            $table->integer('miles')->nullable();
            $table->string('rate_type')->nullable();

            $table->json('data');
            $table->timestamps();

            $table->unique(['version_id', 'strategy']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('version_quotes');
    }
}

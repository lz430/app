<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSeatingCapacityToDealsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->integer('seating_capacity')->after('days_old')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('seating_capacity');
        });
    }
}

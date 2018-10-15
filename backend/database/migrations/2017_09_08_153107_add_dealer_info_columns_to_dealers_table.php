<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDealerInfoColumnsToDealersTable extends Migration
{
    public function up()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->string('route_one_id')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_title')->nullable();
        });
    }

    public function down()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn('route_one_id');
            $table->dropColumn('address');
            $table->dropColumn('city');
            $table->dropColumn('state');
            $table->dropColumn('zip');
            $table->dropColumn('phone');
            $table->dropColumn('contact_name');
            $table->dropColumn('contact_title');
        });
    }
}

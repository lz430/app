<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Make100mTheDefaultMaxDeliveryMiles extends Migration
{
    public function up()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->unsignedInteger('max_delivery_miles')->default(100)->change();
        });
    }

    public function down()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->unsignedInteger('max_delivery_miles')->change();
        });
    }
}

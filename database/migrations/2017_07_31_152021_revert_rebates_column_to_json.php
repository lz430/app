<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RevertRebatesColumnToJson extends Migration
{
    public function up()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('rebates');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->json('rebates')->after('deal_id')->nullable();
        });
    }

    public function down()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('rebates');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->text('rebates');
        });
    }
}

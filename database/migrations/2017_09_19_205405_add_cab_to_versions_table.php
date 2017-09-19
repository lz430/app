<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCabToVersionsTable extends Migration
{
    public function up()
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->string('cab')->after('body_style')->nullable();
        });
    }

    public function down()
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->dropColumn('cab');
        });
    }
}

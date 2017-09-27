<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSegmentToVersionsTable extends Migration
{
    public function up()
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->string('segment')->after('body_style')->nullable();
        });
    }

    public function down()
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->dropColumn('segment');
        });
    }
}
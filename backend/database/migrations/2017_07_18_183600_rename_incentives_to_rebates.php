<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameIncentivesToRebates extends Migration
{
    public function __construct()
    {
        DB::getDoctrineSchemaManager()->getDatabasePlatform()->registerDoctrineTypeMapping('json', 'string');
    }

    public function up()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->renameColumn('incentives', 'rebates');
        });
    }

    public function down()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->renameColumn('rebates', 'incentives');
        });
    }
}

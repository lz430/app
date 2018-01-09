<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveSelectOneDmrFeatureFlagFromDmrCategoriesTable extends Migration
{
    public function up()
    {
        Schema::table('dmr_categories', function (Blueprint $table) {
            $table->dropColumn('select_one_dmr_feature');
        });
    }
}

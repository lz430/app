<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteDealVersionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->integer('version_id')
                ->default(123) // not actually true just left for sqlite @todo
                ->references('id')
                ->on('versions')
                ->onDelete('cascade');
        });

        DB::table('deal_version')->get()->each(function ($link) {
            DB::table('deals')
                ->where('id', $link->deal_id)
                ->update(['version_id' => $link->version_id]);
        });

        Schema::dropIfExists('deal_version');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deal_versions', function (Blueprint $table) {
            // Nope.
        });
    }
}

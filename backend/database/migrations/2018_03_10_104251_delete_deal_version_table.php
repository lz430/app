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
            $table->unsignedInteger('version_id')
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
        Schema::create('deal_version', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('deal_id');
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['deal_id', 'version_id']);
        });

        DB::table('deals')->get()->each(function ($deal) {
            if (! $deal->version_id) {
                return;
            }

            DB::table('deal_version')->insert([
                'deal_id' => $deal->id,
                'version_id' => $deal->version_id,
            ]);
        });

        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('version_id');
        });
    }
}

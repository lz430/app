<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVersionDealPhotosTable extends Migration
{
    public function up()
    {
        Schema::create('version_deal_photos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('version_deal_id');
            $table->foreign('version_deal_id')->references('id')->on('version_deals')->onDelete('cascade');
            $table->string('url');
            $table->unique(['version_deal_id', 'url']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('version_deal_photos');
    }
}

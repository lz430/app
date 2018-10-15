<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIncentivesTables extends Migration
{
    public function up()
    {
        /*
        Schema::create('incentives', function (Blueprint $table) {
            $table->increments('id');
            $table->string('makeName');
            $table->bigInteger('subProgramID');
            $table->string('title');
            $table->longText('description');
            $table->bigInteger('categoryID');
            $table->bigInteger('typeID');
            $table->bigInteger('targetID');
            $table->date('validFrom');
            $table->date('validTo');
            $table->string('revisionNumber')->nullable();
            $table->string('revisionDescription')->nullable();
            $table->date('revisionDate')->nullable();
            $table->string('restrictions')->nullable();
            $table->longText('comments')->nullable();
            $table->string('statusName');
            $table->string('statusID');
            $table->string('cash')->nullable();
            $table->string('cashRequirements')->nullable();
            $table->string('categoryName');
            $table->string('targetName')->nullable();
            $table->string('typeName')->nullable();
            $table->longText('states')->nullable();
            $table->unique(['subProgramID', 'title']);
            $table->timestamps();
        });
        */

        Schema::table('versions', function (Blueprint $table) {
            $table->unique(['jato_vehicle_id']);
        });

        /*
        Schema::create('incentive_version', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('incentive_id');
            $table->foreign('incentive_id')->references('id')->on('incentives')->onDelete('cascade');
            $table->unsignedInteger('version_id');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
            $table->unique(['version_id', 'incentive_id']);
        });
        */
    }

    public function down()
    {
        Schema::dropIfExists('incentive_version');
        Schema::dropIfExists('incentives');
        Schema::table('versions', function (Blueprint $table) {
            $table->dropUnique(['jato_vehicle_id']);
        });
    }
}

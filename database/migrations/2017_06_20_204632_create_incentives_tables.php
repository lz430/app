<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIncentivesTables extends Migration
{
    public function up()
    {
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
            $table->string('comments')->nullable();
            $table->string('statusName');
            $table->string('statusID');
            $table->string('cash')->nullable();
            $table->string('cashRequirements')->nullable();
            $table->string('categoryName');
            $table->string('targetName')->nullable();
            $table->string('typeName')->nullable();
            $table->string('states')->nullable();
            $table->string('regions')->nullable();
            $table->unique(['subProgramID', 'title']);
            $table->timestamps();
        });

        Schema::create('vehicle_incentives', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('incentive_id');
            $table->foreign('incentive_id')->references('id')->on('incentives')->onDelete('cascade');
            $table->bigInteger('jato_vehicle_id');
            $table->unique(['jato_vehicle_id', 'incentive_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicle_incentives');
        Schema::dropIfExists('incentives');
    }
}

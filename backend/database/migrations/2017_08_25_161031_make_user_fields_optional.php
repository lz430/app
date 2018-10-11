<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeUserFieldsOptional extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->string('phone_number')->nullable()->change();
            $table->string('api_token', 60)->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->required()->change();
            $table->string('email')->required()->change();
            $table->string('password')->required()->change();
            $table->string('phone_number')->required()->change();
            $table->string('api_token', 60)->required()->change();
        });
    }
}

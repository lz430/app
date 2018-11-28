<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPhoneNumberToUsersTable extends Migration
{
    public function up()
    {
        /*
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->after('api_token');
        });
        */
    }

    public function down()
    {
        /*
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });
        */
    }
}

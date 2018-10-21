<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAdditionalVersionPhotoFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('versions_photos', function (Blueprint $table) {
            $table->string('type')->nullable()->after('url');
            $table->string('description')->nullable()->after('type');
            $table->string('color_simple')->nullable()->after('color');
            $table->string('color_rgb')->nullable()->after('color_simple');
            $table->string('color')->nullable()->change();
            $table->unique('url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('versions_photos', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('description');
            $table->dropColumn('color_simple');
            $table->dropColumn('color_rgb');
            $table->string('color')->change();

        });
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSchemaForPurchases extends Migration
{
    public function up()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->string('type')->after('rebates');
            $table->decimal('amount_financed')->after('rebates')->nullable();
            $table->decimal('msrp')->after('rebates')->nullable();
            $table->unsignedInteger('term')->after('rebates')->nullable();
        });
    }

    public function down()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('amount_financed');
            $table->dropColumn('term');
            $table->dropColumn('msrp');
        });
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIncentivesAndCompletedAtToPurchasesTable extends Migration
{
    public function up()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->json('incentives')->after('deal_id')->nullable();
            // $table->decimal('dmr_price')->after('incentives');
            $table->dateTime('completed_at')->after('dmr_price')->nullable();
        });
    }

    public function down()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('incentives');
            // $table->dropColumn('dmr_price');
            $table->dropColumn('completed_at');
        });
    }
}

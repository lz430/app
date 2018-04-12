<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAcquisitionCvrRegistrationPlateTransferFeesToDealersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->decimal('cvr_fee', 10, 4)->after('name')->default(24);
            $table->decimal('registration_fee', 10, 4)->after('cvr_fee')->default(23);
            $table->decimal('acquisition_fee', 10, 4)->after('registration_fee')->default(640);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn('cvr_fee');
            $table->dropColumn('registration_fee');
            $table->dropColumn('acquisition_fee');
        });
    }
}

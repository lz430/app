<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDealerContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dealer_contacts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('dealer_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('title')->nullable();
            $table->timestamps();
        });

        // Populates dealer_contacts table with the contact info from the dealers table
        $dealerData = \App\Models\Dealer::select('dealer_id', 'phone', 'contact_name', 'contact_email', 'contact_title')->get();
        foreach ($dealerData as $data) {
            DB::table('dealer_contacts')->insert(
                [
                    'dealer_id' => $data->dealer_id,
                    'phone' => $data->phone,
                    'name' => $data->contact_name,
                    'email' => $data->contact_email,
                    'title' => $data->contact_title,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }

        // Removes contact columns from dealers table
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn('phone');
            $table->dropColumn('contact_name');
            $table->dropColumn('contact_email');
            $table->dropColumn('contact_title');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dealer_contacts');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ReplaceVersionOptionWithOptionGroupAndOptions extends Migration
{
    public function up()
    {
        Schema::dropIfExists('saved_vehicle_version_option');
        Schema::dropIfExists('version_deal_options');
        Schema::dropIfExists('version_options');

        /*
         * Equipment
        "vehicleId": 61539620000131,
        "optionId": 4,
        "optionCode": "R92",
        "optionType": "O",
        "msrp": 719,
        "discount": 0,
        "invoicePrice": 338,
        "optionName": "6-Disc CD Autochanger",
        "optionState": "Available",
        "optionStateTranslation": "Available",
        "optionDescription": "Disc autochanger 6<br\/>Audio system with Disc Autochanger and six-disc remote changer"
         */
        Schema::create('options', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('jato_vehicle_id');
            $table->unsignedBigInteger('jato_option_id');
            $table->string('code');
            $table->string('type')->nullable();
            $table->decimal('msrp')->nullable();
            $table->decimal('discount')->nullable();
            $table->decimal('invoice')->nullable();
            $table->string('name');
            $table->string('state')->nullable();
            $table->string('state_translation')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
        });

        /* Equipment
        "optionId": 0,
        "links": [
        {
        "href": "https:\/\/api.jatoflex.com\/api\/en-us\/vehicle\/61539620000131",
        "rel": "self"
        }
        ],
        "vehicleId": 61539620000131,
        "schemaId": 4001,
        "categoryId": 1,
        "category": "Comfort & Convenience",
        "name": "Remote trunk\/hatch release",
        "location": null,
        "availability": "not available",
        "attributes": [],
        "value": null
         */
        Schema::create('equipment', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('jato_option_id')->nullable();
            $table->unsignedBigInteger('jato_vehicle_id');
            $table->unsignedBigInteger('jato_schema_id');
            $table->unsignedBigInteger('jato_category_id');
            $table->string('category');
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('availability')->nullable();
            $table->string('value')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('options');
        Schema::dropIfExists('equipment');
        Schema::create('saved_vehicle_version_option', function (Blueprint $table) {
            $table->increments('id');
        });
        Schema::create('version_deal_options', function (Blueprint $table) {
            $table->increments('id');
        });
        Schema::create('version_options', function (Blueprint $table) {
            $table->increments('id');
        });
    }
}

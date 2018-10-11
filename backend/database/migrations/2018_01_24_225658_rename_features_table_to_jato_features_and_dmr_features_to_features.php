<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameFeaturesTableToJatoFeaturesAndDmrFeaturesToFeatures extends Migration
{
    public function up()
    {
        Schema::rename('features', 'jato_features');
        Schema::rename('dmr_features', 'features');
        
        Schema::rename('deal_feature', 'deal_jato_feature');
        Schema::rename('deal_dmr_feature', 'deal_feature');
        
        Schema::rename('dmr_categories', 'categories');

        Schema::table('features', function (Blueprint $table) {
            $table->renameColumn('dmr_category_id', 'category_id');
        });

        Schema::table('deal_feature', function (Blueprint $table) {
            $table->renameColumn('dmr_feature_id', 'feature_id');
        });

        Schema::table('deal_jato_feature', function (Blueprint $table) {
            $table->renameColumn('feature_id', 'jato_feature_id');
        });
    }

    public function down()
    {
        Schema::rename('features', 'dmr_features');
        Schema::rename('jato_features', 'features');

        Schema::rename('deal_feature', 'deal_dmr_feature');
        Schema::rename('deal_jato_feature', 'deal_feature');

        Schema::rename('categories', 'dmr_categories');

        Schema::table('dmr_features', function (Blueprint $table) {
            $table->renameColumn('category_id', 'dmr_category_id');
        });

        Schema::table('deal_dmr_feature', function (Blueprint $table) {
            $table->renameColumn('feature_id', 'dmr_feature_id');
        });

        Schema::table('deal_feature', function (Blueprint $table) {
            $table->renameColumn('jato_feature_id', 'feature_id');
        });
    }
}

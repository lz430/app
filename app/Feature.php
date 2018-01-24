<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];

    protected $casts = [
        'jato_schema_ids' => 'array'
    ];

    protected $table = 'dmr_features';

    public function category()
    {
        return $this->belongsTo(DmrCategory::class, 'dmr_category_id');
    }

    public function deals()
    {
         return $this->belongsToMany(Deal::class, 'deal_dmr_feature', 'dmr_feature_id', 'deal_id');
    }
}

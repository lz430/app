<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DmrFeature extends Model
{
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];

    public function category()
    {
        return $this->belongsTo(DmrCategory::class, 'dmr_category_id');
    }

    public function deals()
    {
         return $this->belongsToMany(Deal::class);
    }

    public function getJatoSchemaIdsAttribute($value)
    {
        return (array) json_decode($value, true);
    }
}

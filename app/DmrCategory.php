<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DmrCategory extends Model
{
    protected $fillable = ['title', 'slug', 'has_custom_jato_mapping', 'display_order'];

    public function features()
    {
        return $this->hasMany(DmrFeature::class, 'dmr_category_id');
    }
}

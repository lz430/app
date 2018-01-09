<?php

namespace App;

use App\DmrCategory;
use Illuminate\Database\Eloquent\Model;

class DmrFeature extends Model
{
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];

    public function category()
    {
        return $this->belongsTo(DmrCategory::class, 'dmr_category_id');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DmrFeature extends Model
{
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];
}

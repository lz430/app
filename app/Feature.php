<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];

    protected $casts = [
        'jato_schema_ids' => 'array'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function deals()
    {
         return $this->belongsToMany(Deal::class);
    }
}

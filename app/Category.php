<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['title', 'slug', 'has_custom_jato_mapping', 'display_order'];

    public function features()
    {
        return $this->hasMany(Feature::class);
    }
}

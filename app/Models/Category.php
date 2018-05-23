<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 */
class Category extends Model
{
    protected $fillable = ['title', 'slug', 'has_custom_jato_mapping', 'display_order'];

    public function features()
    {
        return $this->hasMany(Feature::class)->whereNotIn('features.id', [5, 14, 19, 21, 29, 44, 61]);
    }
}

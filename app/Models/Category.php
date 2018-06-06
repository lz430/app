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
        return $this->hasMany(Feature::class)->whereNotIn('features.id', [5, 9, 10, 14, 19, 20, 21, 29, 42, 44, 46, 54, 55, 59, 61])->orderBy('display_order', 'asc');
    }
}

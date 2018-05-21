<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Feature extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['title', 'slug', 'dmr_category_id', 'display_order', 'jato_schema_ids'];

    /**
     * @var array
     */
    protected $casts = [
        'jato_schema_ids' => 'array'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category() : BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function deals() : BelongsToMany
    {
        return $this->belongsToMany(Deal::class);
    }
}

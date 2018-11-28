<?php

namespace App\Models;

use Backpack\CRUD\CrudTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * TODO: Rename jato_schema_ids to map_jato_features.
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property array|null $jato_schema_ids
 * @property array|null $map_vauto_features
 * @property int $display_order
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property int $category_id
 * @property Category $category
 * @property int $is_active
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereDisplayOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereJatoSchemaIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereMapVautoFeatures($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature withJatoSchemaId($schemaId)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Feature withVautoFeature($feature)
 * @mixin \Eloquent
 */
class Feature extends Model
{
    use CrudTrait;

    /**
     * @var array
     */
    protected $casts = [
        'jato_schema_ids' => 'array',
        'map_vauto_features' => 'array',
    ];

    /**
     * @var array
     */
    protected $fillable = [
        'is_active',
        'title',
        'slug',
        'category_id',
        'display_order',
        'jato_schema_ids',
        'map_vauto_features',
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

    /**
     * @param Builder $query
     * @param int $schemaId
     * @return Builder
     */
    public function scopeWithJatoSchemaId(Builder $query, int $schemaId): Builder
    {
        return $query->whereRaw('JSON_CONTAINS(jato_schema_ids, ?)', [[(string) $schemaId]]);
    }

    /**
     * @param Builder $query
     * @param string $feature
     * @return Builder
     */
    public function scopeWithVautoFeature(Builder $query, string $feature): Builder
    {
        return $query->whereRaw('JSON_CONTAINS(LOWER(map_vauto_features), JSON_ARRAY(LOWER(?)))', [$feature]);
    }
}

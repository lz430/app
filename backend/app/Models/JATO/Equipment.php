<?php

namespace App\Models\JATO;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\JATO\Equipment.
 *
 * @property int $id
 * @property int $version_id
 * @property int $option_id
 * @property int $schema_id
 * @property int $category_id
 * @property string $category
 * @property string $name
 * @property string|null $location
 * @property string $availability
 * @property string|null $value
 * @property mixed $aspects
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @property-read \App\Models\JATO\Version $version
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereAttributes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereAvailability($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereOptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereSchemaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereVersionId($value)
 * @mixin \Eloquent
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Equipment whereAspects($value)
 */
class Equipment extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'aspects' => 'object',
    ];

    protected $fillable = [
        'version_id',
        'option_id',
        'vehicle_id',
        'schema_id',
        'category_id',
        'category',
        'name',
        'location',
        'availability',
        'value',
        'aspects',
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    public function deals() : BelongsToMany
    {
        return $this->belongsToMany(Deal::class);
    }

    /**
     * We use this to override standard equipment
     * with optional. The extra e is because when merging
     * arrays by key, if it's numerical the array is appended
     * but if it's a string, the values are overridden.
     * @return int|string
     */
    public function slug() {
        $slug = "e-" . (string) $this->schema_id;
        if ($this->location) {
            $slug .= '-' . str_slug($this->location);
        }
        return $slug;
    }
}

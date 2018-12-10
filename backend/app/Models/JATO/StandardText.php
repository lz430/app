<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;
use Backpack\CRUD\CrudTrait;
use App\Models\JATO\Version;
use ScoutElastic\Searchable;
use App\DealIndexConfigurator;
use DeliverMyRide\Fuel\Map as ColorMaps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\JATO\StandardText
 *
 * @property int $id
 * @property int $version_id
 * @property int $schema_id
 * @property int $category_id
 * @property string $category
 * @property string $item_name
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\JATO\Version $version
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereItemName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereSchemaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\StandardText whereVersionId($value)
 * @mixin \Eloquent
 */
class StandardText extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'version_id',
        'schema_id',
        'category_id',
        'category',
        'item_name',
        'content',
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }
}

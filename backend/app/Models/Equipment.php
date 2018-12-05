<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\JATO\Version;
use Backpack\CRUD\CrudTrait;
use ScoutElastic\Searchable;
use App\DealIndexConfigurator;
use DeliverMyRide\Fuel\Map as ColorMaps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Equipment extends Model
{
    protected $guarded = ['id'];

    /*protected $casts = [
        'attributes' => 'object',
    ];*/

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
        'attributes',
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    public function getAttributesAttribute($value)
    {
        return json_decode($value);
    }
}

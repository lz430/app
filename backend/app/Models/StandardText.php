<?php

namespace App\Models;

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

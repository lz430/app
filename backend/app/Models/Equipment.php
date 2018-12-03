<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    use CrudTrait;

    protected $guarded = ['id'];

    protected $casts = [
        'attributes' => 'object',
    ];

    protected $fillable = [
        'deal_id',
        'option_id',
        'vehicle_id',
        'schema_id',
        'category_id',
        'name',
        'location',
        'availability',
        'value',
        'attributes',
    ];
}

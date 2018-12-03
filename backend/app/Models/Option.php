<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Backpack\CRUD\CrudTrait;
use ScoutElastic\Searchable;
use App\DealIndexConfigurator;
use DeliverMyRide\Fuel\Map as ColorMaps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Option extends Model
{
    use CrudTrait;

    protected $guarded = ['id'];

    protected $fillable = [
        'deal_id',
        'vehicle_id',
        'option_id',
        'option_code',
        'option_type',
        'msrp',
        'invoice_price',
        'option_name',
        'option_state_name',
        'option_state',
        'option_description'
    ];
}

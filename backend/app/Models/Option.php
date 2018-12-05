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

class Option extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'version_id',
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

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }
}

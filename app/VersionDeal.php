<?php

namespace App;

use App\JATO\Version;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class VersionDeal extends Model
{
    protected $guarded = [];
    protected $dates = ['inventory_date'];

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function options()
    {
        return $this->hasMany(VersionDealOption::class);
    }

    public function photos()
    {
        return $this->hasMany(VersionDealPhoto::class);
    }

    public static function allFuelTypes()
    {
        return self::select('fuel')->groupBy('fuel')->get()->pluck('fuel');
    }
    
    public function scopeFilterByFuelType(Builder $query, $fuelTypes) : Builder
    {
        if (! is_array($fuelTypes)) {
            $fuelTypes = [$fuelTypes];
        }
        
        return $query->whereIn(
            DB::raw('lower(fuel)'),
            array_map('strtolower', $fuelTypes)
        );
    }
}

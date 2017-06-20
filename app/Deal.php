<?php

namespace App;

use App\JATO\Version;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Deal extends Model
{
    protected $guarded = [];
    protected $dates = ['inventory_date'];

    public function versions()
    {
        return $this->belongsToMany(Version::class);
    }

    public function options()
    {
        return $this->hasMany(DealOption::class);
    }

    public function photos()
    {
        return $this->hasMany(DealPhoto::class);
    }
    
    public function features()
    {
        return $this->belongsToMany(Feature::class)->hasGroup();
    }

    public static function allFuelTypes()
    {
        return self::select('fuel')->where('fuel', '!=', '')->groupBy('fuel')->get()->pluck('fuel');
    }
    
    public function scopeFilterByFuelType(Builder $query, $fuelType) : Builder
    {
        return $query->where('fuel', $fuelType);
    }
    
    public function scopeFilterByAutomaticTransmission(Builder $query) : Builder
    {
        return $query->where(
            'transmission',
            'like',
            '%auto%'
        )->orWhere(
            'transmission',
            'like',
            '%cvt%'
        );
    }

    public function scopeFilterByManualTransmission(Builder $query) : Builder
    {
        return $query->where(
            'transmission',
            'not like',
            '%auto%'
        )->where(
            'transmission',
            'not like',
            '%cvt%'
        );
    }
}

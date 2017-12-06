<?php

namespace App;

use App\JATO\Version;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    const HOLD_HOURS = 48;
    
    protected $guarded = [];
    protected $dates = ['inventory_date'];

    public function versions()
    {
        return $this->belongsToMany(Version::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function options()
    {
        return $this->hasMany(DealOption::class);
    }

    public function photos()
    {
        return $this->hasMany(DealPhoto::class)->orderBy('id');
    }
    
    public function features()
    {
        return $this->belongsToMany(Feature::class)->hasGroup();
    }
    
    public function featuredPhoto()
    {
        return ($this->photos && $this->photos->first())
            ? $this->photos->first()
            : null;
    }

    public static function allFuelTypes()
    {
        return self::select('fuel')->where('fuel', '!=', '')->groupBy('fuel')->get()->pluck('fuel');
    }

    /**
     * Mysql spatial function use to find spherical (earth) distance between 2 coordinate pairs
     * Mysql point : longitude, latitude.
     * 3857 (SRID) is the Google Maps / Bing Maps Spherical Mercator Projection (values should be comparable)
     * .000621371192 meters in a mile
     * 6378137 (google maps uses 6371000) radius of the earth in meters
     * Google maps coordinate accuracy is to 7 decimal places
     * Need to use GeomFromText in order to set the SRID
     */
    public function scopeServesLocation(Builder $query, $latitude, $longitude) : Builder
    {
        return $query->whereHas('dealer', function (Builder $q) use ($latitude, $longitude) {
            $q->whereRaw("
               ST_Distance_sphere(
                    point(longitude, latitude),
                    point(?, ?)
                ) * .000621371192 < max_delivery_miles
            ", [
                $longitude,
                $latitude,
            ]);
        });
    }
    
    public function scopeFilterByFuelType(Builder $query, $fuelType) : Builder
    {
        return $query->where('fuel', $fuelType);
    }

    public function dealer()
    {
        return $this->belongsTo(
            Dealer::class,
            'dealer_id',
            'dealer_id'
        );
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
    
    public function scopeForSale(Builder $query) : Builder
    {
        return $query->whereDoesntHave('purchases', function (Builder $q) {
            $q->where('completed_at', '>=', Carbon::now()->subHours(self::HOLD_HOURS));
        });
    }
}

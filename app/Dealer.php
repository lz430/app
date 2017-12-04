<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'dealer_id',
        'latitude',
        'longitude',
        'name',
        'max_delivery_miles',
        'route_one_id',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'contact_name',
        'contact_title',
    ];

    public function deals()
    {
        return $this->hasMany(
            Deal::class,
            'dealer_id',
            'dealer_id'
        );
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
    public function scopeFilterByLocationDistance(Builder $query, $latitude, $longitude) : Builder
    {
        return $query->whereRaw("
               ST_Distance_sphere(
                    point(longitude, latitude),
                    point(?, ?)
                ) * .000621371192 < max_delivery_miles
            ", [
            $longitude,
            $latitude,
        ]);
    }
}

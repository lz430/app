<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Backpack\CRUD\CrudTrait;


/**
 * @property int $id
 * @property boolean $is_active
 * @property  \stdClass $price_rules
 * @property $acquisition_fee
 * @property $doc_fee
 * @property $registration_fee
 * @property $cvr_fee
 */
class Dealer extends Model
{
    use CrudTrait;

    /**
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * @var array
     */
    protected $casts = [
        'price_rules' => 'object',
    ];


    /**
     * @var array
     */
    protected $fillable = [
        'is_active',
        'dealer_id',
        'latitude',
        'longitude',
        'name',
        'acquisition_fee',
        'registration_fee',
        'doc_fee',
        'cvr_fee',
        'max_delivery_miles',
        'route_one_id',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'contact_email',
        'contact_name',
        'contact_title',
        'price_rules',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function deals() : HasMany
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
    public function scopeServesLocation(Builder $query, $latitude, $longitude) : Builder
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

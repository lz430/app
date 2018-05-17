<?php

namespace App\Models;

use App\Models\JATO\Version;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


/**
 * @property int $id
 * @property string $file_hash
 * @property int $dealer_id
 * @property Dealer $dealer
 * @property string $stock_number
 * @property string $vin
 * @property boolean $new
 * @property string $year
 * @property string $make
 * @property string $model
 * @property string $model_code
 * @property string $body
 * @property string $transmission
 * @property string $series
 * @property string $series_Detail
 * @property string $door_count
 * @property string $odometer
 * @property string $engine
 * @property string $fuel
 * @property string $color
 * @property string $interior_color
 * @property float|null $price
 * @property float|null $msrp
 * @property string|null $vauto_features
 * @property \DateTime $inventory_date
 * @property boolean|null $certified
 * @property string|null $description
 * @property array|null $option_codes
 * @property int|null $fuel_econ_city
 * @property int|null $fuel_econ_hwy
 * @property string $dealer_name
 * @property int $days_old
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property int $version_id
 */
class Deal extends Model
{
    const HOLD_HOURS = 48;

    /**
     * @var array
     */
    protected $guarded = [];

    /**
     * @var array
     */
    protected $dates = ['inventory_date'];

    /**
     * @var array
     */
    protected $casts = [
        'option_codes' => 'array'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function version() : BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchases() : HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function options() : HasMany
    {
        return $this->hasMany(DealOption::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function photos() : HasMany
    {
        return $this->hasMany(DealPhoto::class)->orderBy('id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function jatoFeatures() : BelongsToMany
    {
        return $this->belongsToMany(JatoFeature::class)->hasGroup();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function features() : BelongsToMany
    {
        return $this->belongsToMany(Feature::class);
    }

    /**
     * @return string|null
     */
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
    public function scopeFilterByLocationDistance(Builder $query, $latitude, $longitude) : Builder
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

    public function scopeFilterByYear(Builder $query, $year) : Builder
    {
        return $query->where('year', $year);
    }

    public function scopeFilterByFuelType(Builder $query, $fuelType) : Builder
    {
        return $query->where('fuel', $fuelType);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function dealer() : BelongsTo
    {
        return $this->belongsTo(
            Dealer::class,
            'dealer_id',
            'dealer_id'
        );
    }

    /**
     * @param Builder $query
     * @return Builder
     */
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

    /**
     * @param Builder $query
     * @return Builder
     */
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

    /**
     * @param Builder $query
     * @return Builder
     */
    public function scopeForSale(Builder $query) : Builder
    {
        return $query->whereDoesntHave('purchases', function (Builder $q) {
            $q->where('completed_at', '>=', Carbon::now()->subHours(self::HOLD_HOURS));
        });
    }
}

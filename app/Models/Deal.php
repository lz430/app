<?php

namespace App\Models;

use App\Models\JATO\Version;
use App\DealIndexConfigurator;
use App\Models\JATO\Make;

use Carbon\Carbon;
use ScoutElastic\Searchable;
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
 * @property string $series_detail
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
 * @property \stdClass|null $source_price
 * @property int|null $fuel_econ_city
 * @property int|null $fuel_econ_hwy
 * @property string $dealer_name
 * @property int $days_old
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property int $version_id
 * @property Version $version
 * @property Purchase[] $purchases
 * @property DealOption[] $options
 * @property DealPhoto[] $photos
 * @property jatoFeature[] $jatoFeatures
 * @property Feature[] $features
 */
class Deal extends Model
{
    use Searchable;

    protected $indexConfigurator = DealIndexConfigurator::class;


    const HOLD_HOURS = 48;

    /**
     * @var array
     */
    protected $mapping = [
        'properties' => [
            'location' => [
                'type' => 'geo_point',
            ],
            'max_delivery_distance' => [
                'type' => 'double',
            ],
        ]
    ];

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
        'option_codes' => 'array',
        'source_price' => 'object'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function options(): HasMany
    {
        return $this->hasMany(DealOption::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function photos(): HasMany
    {
        return $this->hasMany(DealPhoto::class)->orderBy('id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function jatoFeatures(): BelongsToMany
    {
        return $this->belongsToMany(JatoFeature::class)->hasGroup();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function features(): BelongsToMany
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

    /**
     *
     * Human title for vehicle.
     * @return string
     */
    public function title(): string
    {
        return implode(" ", [
            $this->year,
            $this->make,
            $this->model,
            $this->series,
        ]);
    }

    public function prices()
    {
        $source = $this->source_price;


        //
        // Migration help
        if (!$source) {
            $source = (object)[
                'msrp' => $this->msrp,
                'price' => $this->price,
            ];
        }

        if (!isset($source->price) || !$source->price) {
            $source->price = ($this->price ? $this->price : $this->msrp);
        }

        if (!isset($source->msrp) || !$source->msrp) {
            $source->msrp = $this->msrp;
        }

        // The defaults when no rules exist.
        $prices = [
            'msrp' => $this->msrp !== '' ? $this->msrp : null,
            'default' => $source->price !== '' ? $source->price : null,
            'employee' => $source->price !== '' ? $source->price : null,
            'supplier' => (in_array(strtolower($this->make), Make::DOMESTIC) ? $source->price * 1.04 : $source->price)
        ];

        $dealer = $this->dealer;

        // Dealer has some special rules
        if ($dealer->price_rules) {
            foreach ($dealer->price_rules as $attr => $field) {

                // If for whatever reason the selected base price for the field doesn't exist or it's false, we fall out
                // so the default role price is used.
                if (!isset($source->{$field->base_field}) || !$source->{$field->base_field}) {
                    continue;
                }

                $prices[$attr] = $source->{$field->base_field};

                if ($field->rules) {
                    foreach ($field->rules as $rule) {
                        switch ($rule->modifier) {
                            case 'add_value':
                                $prices[$attr] += $rule->value;
                                break;
                            case 'subtract_value':
                                $prices[$attr] -= $rule->value;
                                break;
                            case 'percent':
                                $prices[$attr] = ($rule->value / 100) * $prices[$attr];
                                break;
                        }
                    }
                }
            }
        }

        return (object)array_map('floatval', $prices);
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
    public function scopeFilterByLocationDistance(Builder $query, $latitude, $longitude): Builder
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

    public function scopeFilterByYear(Builder $query, $year): Builder
    {
        return $query->where('year', $year);
    }

    public function scopeFilterByFuelType(Builder $query, $fuelType): Builder
    {
        return $query->where('fuel', $fuelType);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function dealer(): BelongsTo
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
    public function scopeFilterByAutomaticTransmission(Builder $query): Builder
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
    public function scopeFilterByManualTransmission(Builder $query): Builder
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
    public function scopeForSale(Builder $query): Builder
    {
        return $query->whereDoesntHave('purchases', function (Builder $q) {
            $q->where('completed_at', '>=', Carbon::now()->subHours(self::HOLD_HOURS));
        });
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $record = [];

        //
        // Basic record information
        $record['id'] = $this->id;
        $record['created_at'] = $this->created_at;
        $record['updated_at'] = $this->updated_at;

        //
        // Vehicle identification information
        $record['vin'] = $this->vin;
        $record['stock'] = $this->stock_number;

        $record['title'] = $this->title();

        //
        // Vehicle type
        $record['year'] = $this->year;
        $record['make'] = $this->make;
        $record['model'] = $this->model;
        $record['series'] = $this->series;

        $record['style'] = $this->version->body_style;

        //
        // Required vehicle attributes
        $record['body'] = $this->body;
        $record['engine'] = $this->engine;
        $record['transmission'] = $this->transmission;
        $record['doors'] = $this->door_count;
        $record['color'] = $this->color;
        $record['interior_color'] = $this->interior_color;

        $record['msrp'] = $this->msrp;

        $record['fuel_econ_city'] = $this->fuel_econ_city;
        $record['fuel_econ_hwy'] = $this->fuel_econ_hwy;

        //
        // Photos
        $record['photos'] = [];
        foreach ($this->photos as $photo) {
            $record['photos'][] = $photo->url;
        }

        $thumbnail = $this->featuredPhoto();
        $record['thumbnail'] = ($thumbnail ? $thumbnail->url : null);

        //
        // Delivery Info
        $record['location'] = (object)[
            'lat' => $this->dealer->latitude,
            'lon' => $this->dealer->longitude,
        ];

        $record['max_delivery_distance'] = (double)$this->dealer->max_delivery_miles;

        //
        // Features
        foreach ($this->features as $feature) {
            if (!isset($record[$feature->category->slug]) || !is_array($record[$feature->category->slug])) {
                $record[$feature->category->slug] = [];
            }

            $record[$feature->category->slug][] = $feature->title;
        }

        //
        // Catchall
        if ($this->vauto_features) {
            $record['misc'] = [];

            $misc = explode("|", $this->vauto_features);
            $misc = array_map('trim', $misc);
            $record['misc'] = $misc;
        }

        $pricing = $this->prices();
        $record['pricing'] = $this->prices();

        //
        // Backwards compatibility with existing frontend stuff
        $record['version'] = $this->version;
        $record['employee_price'] = $pricing->employee;
        $record['supplier_price'] = $pricing->supplier;
        $record['doc_fee'] = (float)$this->dealer->doc_fee;
        $record['cvr_fee'] = (float)$this->dealer->cvr_fee;
        $record['registration_fee'] = (float)$this->dealer->registration_fee;
        $record['acquisition_fee'] = (float)$this->dealer->acquisition_fee;

        return $record;
    }
}

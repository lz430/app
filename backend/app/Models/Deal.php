<?php

namespace App\Models;

use App\Models\JATO\Version;
use App\DealIndexConfigurator;
use App\Models\Order\Purchase;
use Backpack\CRUD\CrudTrait;
use Carbon\Carbon;
use ScoutElastic\Searchable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use DeliverMyRide\Fuel\Map as ColorMaps;


/**
 * App\Models\Deal
 *
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
 * @property array|null $package_codes
 * @property \stdClass|null $source_price
 * @property \stdClass|null $payments
 * @property int|null $fuel_econ_city
 * @property int|null $fuel_econ_hwy
 * @property string $dealer_name
 * @property int $days_old
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property int $version_id
 * @property Version $version
 * @property Purchase[] $purchases
 * @property DealPhoto[] $photos
 * @property jatoFeature[] $jatoFeatures
 * @property Feature[] $features
 * @property int $seating_capacity
 * @property string $vehicle_color
 * @property string $status
 * @property \Datetime $sold_at
 * @property \Datetime photos_updated_at
 * @property \Highlight|null $highlight
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal forSale()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereCertified($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereDaysOld($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereDealerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereDealerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereDoorCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereEngine($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereFileHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereFuel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereFuelEconCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereFuelEconHwy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereInteriorColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereInventoryDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereModelCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereMsrp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereNew($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereOdometer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereOptionCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal wherePackageCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal wherePayments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereSeatingCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereSeries($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereSeriesDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereSoldAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereSourcePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereStockNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereTransmission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereVautoFeatures($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereVersionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereVin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal whereYear($value)
 * @mixin \Eloquent
 */
class Deal extends Model
{
    use Searchable;
    use CrudTrait;

    protected $indexConfigurator = DealIndexConfigurator::class;

    const HOLD_HOURS = 48;

    private const CATEGORY_MAP = [
        'vehicle_size' => [
            'title' => 'Size',
        ],
        'fuel_type' => [
            'title' => 'Fuel Type',
        ],
        'transmission' => [
            'title' => 'Transmission',
        ],
        'drive_train' => [
            'title' => 'Drive Train',
        ],
        'comfort_and_convenience' => [
            'title' => 'Comfort & Convenience',
        ],
        'seating' => [
            'title' => 'Seating',
        ],
        'seat_materials' => [
            'title' => 'Seat Materials',
        ],
        'seating_configuration' => [
            'title' => 'Seating Configuration',
        ],
        'infotainment' => [
            'title' => 'Infotainment',
        ],
        'interior' => [
            'title' => 'Interior',
        ],
        'safety_and_driver_assist' => [
            'title' => 'Safety & Driver Assist',
        ],
        'pickup' => [
            'title' => 'Pickup',
        ],
        'seating_capacity' => [
            'title' => 'Seating Capacity',
        ],
        'vehicle_color' => [
            'title' => 'Vehicle Color',
        ],
    ];


    /**
     * @var array
     */
    protected $mapping = [
        'properties' => [
            'created_at' => [
                'type' => 'date',
            ],
            'updated_at' => [
                'type' => 'date',
            ],
            'sold_at' => [
                'type' => 'date',
            ],
            'inventory_date' => [
                'type' => 'date',
            ],
            'location' => [
                'type' => 'geo_point',
            ],
            'max_delivery_distance' => [
                'type' => 'double',
            ],
            'category' => [
                'type' => 'nested',
                'properties' => [
                    'id' => [
                        'type' => 'long'
                    ],
                    'thumbnail' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 512
                            ]
                        ]
                    ],
                    'title' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256
                            ]
                        ]
                    ]
                ]
            ],
            'msrp' => [
                'type' => 'double',
            ],
            'supplier_price' => [
                'type' => 'double',
            ],
            'employee_price' => [
                'type' => 'double',
            ],
            'default_price' => [
                'type' => 'double',
            ],
            'seating_capacity' => [
                'type' => 'integer'
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
    protected $dates = ['inventory_date', 'photos_updated_at', 'sold_at'];

    /**
     * @var array
     */
    protected $casts = [
        'option_codes' => 'array',
        'package_codes' => 'array',
        'source_price' => 'object',
        'payments' => 'object',
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
     * In some situations we don't have photos for the specific vehicle,
     * so we use stock photos in some situations, which are stored on the version.
     * @param string $size
     * @return array|\Illuminate\Database\Eloquent\Collection
     */
    public function marketingPhotos($size = 'full')
    {
        $photos = [];

        //
        //
        $groups = [
            'real',
            'stock_accurate',
            'stock_simple',
            'stock_default',
        ];

        foreach ($groups as $group) {
            if (count($photos)) {
                continue;
            }

            // Real photos are deleted if the vehicle has been sold.
            if ($group === 'real' && $this->status !== 'available') {
                continue;
            }

            // We need versions for all non-real photo group options.
            if ($group !== 'real' && !$this->version) {
                continue;
            }

            switch ($group) {
                case 'real':

                    $dealPhotos = $this->photos()->get();
                    if (count($dealPhotos) > 1) {
                        $dealPhotos->shift();
                        $photos = $dealPhotos;
                        $photos[0]->thumbnail = generate_asset_url($photos[0], 'thumbnail');
                    }

                    break;
                case 'stock_accurate':
                    $accurateColorPhotos = $this->version->photos()
                        ->where('type', '=', 'color')
                        ->where('color', '=', $this->color)
                        ->orderBy('shot_code')
                        ->get();

                    if (count($accurateColorPhotos)) {
                        $photos = $accurateColorPhotos;

                        // Select featured photo
                        $photos = collect($photos)->map(function($photo) {
                            if (isset($photo->shot_code) && $photo->shot_code === 'KAD') {
                                $photo->thumbnail = generate_asset_url($photo->url, 'thumbnail');
                            }
                            return $photo;

                        })->all();
                    }
                    break;

                case 'stock_simple':
                    $simpleColorPhotos = $this->version->photos()->where('type', '=', 'color')->where('color_simple', '=', $this->simpleExteriorColor())->orderBy('shot_code')->get();
                    if (count($simpleColorPhotos)) {
                        $photos = $simpleColorPhotos;

                        // Select featured photo
                        $photos = collect($photos)->map(function($photo) {
                            if (isset($photo->shot_code) && $photo->shot_code === 'KAD') {
                                $photo->thumbnail = generate_asset_url($photo->url, 'thumbnail');
                            }
                            return $photo;

                        })->all();
                    }

                    break;

                case 'stock_default':
                    $versionPhotos = $this->version->photos()->where('color', '=', 'default')->orderBy('shot_code')->get();
                    if (count($versionPhotos)) {
                        $photos = $versionPhotos;

                        // Select featured photo
                        $photos = collect($photos)->map(function($photo) {
                            if (isset($photo->shot_code) && $photo->shot_code === 'KAD') {
                                $photo->thumbnail = generate_asset_url($photo->url, 'thumbnail');
                            }
                            return $photo;

                        })->all();
                    }

                    break;

            }
        }

        foreach ($photos as &$photo) {
            $photo->url = generate_asset_url($photo->url, $size);
        }

        return $photos;
    }

    /**
     * @param string $size
     * @param array $photos
     * @return mixed|null
     */
    public function featuredPhoto($size = 'thumbnail', $photos = [])
    {
        if (!is_array($photos) || !count($photos)) {
            $photos = $this->marketingPhotos($size);
        }

        //
        // Only the featured photo has a thumbnail.
        return collect($photos)->first(function($photo) {
            return isset($photo->thumbnail);
        });
    }

    /**
     * @return null|string
     */
    public function simpleExteriorColor(): ?string
    {
        if (!$this->color) {
            return null;
        }

        if (isset(ColorMaps::COLOR_MAP[$this->color])) {
            return ColorMaps::COLOR_MAP[$this->color];
        }

        foreach (ColorMaps::COLOR_MAP as $key => $value) {
            if (str_contains($key, $this->color)) {
                return $value;
            }
        }

        return null;
    }

    /**
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

    /**
     * Returns an object of various price roles for this deal. Applies
     * dealer pricing rules and whatnot.
     * @return object
     */
    public function prices(): \stdClass
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

        if (!isset($source->msrp) || !$source->msrp) {
            $source->msrp = $this->msrp;
        }

        if (!isset($source->price) || !$source->price) {
            $source->price = ($this->price ? $this->price : $this->msrp);
        }

        // The defaults when no rules exist.
        $prices = [
            'msrp' => $source->msrp,
            'default' => $source->msrp !== '' ? $source->msrp : null,
            'employee' => $source->msrp !== '' ? $source->msrp : null,
            'supplier' => $source->msrp !== '' ? $source->msrp : null,
        ];

        $dealer = $this->dealer;

        // Dealer has some special rules
        if ($dealer && $dealer->price_rules) {
            foreach ($dealer->price_rules as $attr => $field) {
                // If for whatever reason the selected base price for the field doesn't exist or it's false, we fall out
                // so the default role price is used.
                if ((!isset($field->base_field) || !$field->base_field) || (!isset($source->{$field->base_field}) || !$source->{$field->base_field})) {
                    continue;
                }

                $prices[$attr] = $source->{$field->base_field};

                if ($field->rules) {
                    foreach ($field->rules as $rule) {

                        //
                        // Conditions
                        if (isset($rule->conditions)) {
                            if (isset($rule->conditions->vin) && $rule->conditions->vin && $rule->conditions->vin != $this->vin) {
                                continue;
                            }

                            if (isset($rule->conditions->make) && $rule->conditions->make && $rule->conditions->make != $this->make) {
                                continue;
                            }

                            if (isset($rule->conditions->model) && $rule->conditions->model && $rule->conditions->model != $this->model) {
                                continue;
                            }

                            if (isset($rule->conditions->year) && $rule->conditions->year && $rule->conditions->year != $this->year) {
                                continue;
                            }
                        }

                        //
                        // Modifier
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
    public function scopeForSale(Builder $query): Builder
    {
        return $query->whereDoesntHave('purchases', function (Builder $q) {
            $q->where('completed_at', '>=', Carbon::now()->subHours(self::HOLD_HOURS));
        });
    }

    /**
     * @return mixed
     * @see https://github.com/babenkoivan/scout-elasticsearch-driver/issues/88
     */
    public function shouldIndex()
    {

        if (!$this->dealer) {
            return FALSE;
        }

        if (!$this->features->count()) {
            return FALSE;
        }

        return TRUE;
    }

    public function shouldBeSearchable()
    {
        $shouldIndex = $this->shouldIndex();
        if (!$shouldIndex) {
            $this->unsearchable();
        }

        return $shouldIndex;
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
        $record['created_at'] = $this->created_at->format('c');
        $record['updated_at'] = $this->updated_at->format('c');
        $record['inventory_date'] = $this->inventory_date->format('c');
        $record['sold_at'] = $this->sold_at ? $this->sold_at->format('c') : null;
        $record['status'] = $this->status;
        $record['is_active'] = true;

        // Deal should not be active if it has been purchased
        if ($this->status == 'sold') {
            $record['is_active'] = false;
        }

        //
        // Vehicle identification information
        $record['vin'] = $this->vin;
        $record['stock'] = $this->stock_number;
        $record['title'] = $this->title();

        //
        // Vehicle type
        $record['year'] = $this->year;
        $record['make'] = ($this->version->model->make->name == 'Infiniti') ? 'INFINITI' : $this->version->model->make->name;
        $record['model'] = $this->version->model->name;
        $record['model_code'] = $this->model_code;
        $record['series'] = $this->series;
        $record['style'] = $this->version->style();
        $record['seating_capacity'] = (int)$this->seating_capacity;

        $filterColor = null;
        $record['vehicle_color'] = $this->simpleExteriorColor();

        //
        // Required vehicle attributes
        $record['body'] = $this->body; // Deprecated
        $record['engine'] = $this->engine;
        $record['doors'] = $this->door_count;
        $record['color'] = $this->color;
        $record['interior_color'] = $this->interior_color;
        $record['fuel_econ_city'] = $this->fuel_econ_city;
        $record['fuel_econ_hwy'] = $this->fuel_econ_hwy;

        //
        // Photos
        $record['photos'] = [];
        $photos = $this->marketingPhotos();
        foreach ($photos as $photo) {
            $record['photos'][] = $photo->toIndexData();
        }

        $record['thumbnail'] = null;
        $thumbnail = $this->featuredPhoto('thumbnail', $photos);
        if ($thumbnail) {
            $record['thumbnail'] = $thumbnail->toIndexData();
        }

        $record['category'] = (object)[
            'id' => $this->version->model->id,
            'title' => implode(" ", [
                $record['make'],
                $record['model'],
            ]),
            'thumbnail' => ($this->version->thumbnail() ? generate_asset_url($this->version->thumbnail()->url) : null),
        ];

        //
        // Delivery Info
        $record['location'] = (object)[
            'lat' => $this->dealer->latitude,
            'lon' => $this->dealer->longitude,
        ];

        $record['max_delivery_distance'] = (double)$this->dealer->max_delivery_miles;

        //
        // Features
        foreach ($this->features()->where('is_active', '=', 1)->get() as $feature) {
            if (!isset($record[$feature->category->slug]) || !is_array($record[$feature->category->slug])) {
                $record[$feature->category->slug] = [];
            }

            $record[$feature->category->slug][] = $feature->title;
        }

        $pricing = $this->prices();
        $record['pricing'] = $pricing;
        $record['payments'] = $this->payments;

        $version = $this->version;
        $record['version'] = null;
        if ($version) {
            $record['version'] = $version->toIndexData();
        }

        $record['dealer'] = $this->dealer->toIndexData();

        //
        // Catchall
        if ($this->vauto_features) {
            $record['misc'] = [];
            $misc = explode("|", $this->vauto_features);
            $misc = array_map('trim', $misc);
            $record['misc'] = $misc;
        }

        //
        // All the features in the current UI are just jammed together.
        $record['legacy_features'] = [];
        foreach ($this->features as $feature) {
            $record['legacy_features'][] = $feature->title;
        }

        //
        // Jato features
        $record['jato_features'] = [];
        foreach ($this->jatoFeatures as $feature) {
            $record['jato_features'][] = $feature->toIndexData();
        }

        return $record;
    }
}

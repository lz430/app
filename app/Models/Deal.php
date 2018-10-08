<?php

namespace App\Models;

use App\Models\JATO\Version;
use App\DealIndexConfigurator;
use App\Models\JATO\Make;
use App\Models\Order\Purchase;
use Backpack\CRUD\CrudTrait;
use Carbon\Carbon;
use ScoutElastic\Searchable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
            'title' => 'Vehicle Size',
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
    protected $dates = ['inventory_date', 'sold_at'];

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
        // Try real photos
        $dealPhotos = $this->photos()->get();
        if (count($dealPhotos) > 1) {
            $dealPhotos->shift();
            $photos = $dealPhotos;
        }

        if (!count($photos) && $this->version) {
            //
            // Try stock photos in the exact color
            $colorPhotos = $this->version->photos()->where('color', '=', $this->color)->orderBy('shot_code')->get();
            if (count($colorPhotos)) {
                $photos = $colorPhotos;
            }

            //
            // Try stock photos in the wrong color
            $versionPhotos = $this->version->photos()->where('color', '=', 'default')->orderBy('shot_code')->get();
            if (count($versionPhotos)) {
                $photos = $versionPhotos;
            }
        }

        foreach ($photos as &$photo) {
            $photo->url = generate_asset_url($photo->url, $size);
        }

        return $photos;
    }

    /**
     * @param string $size
     * @return mixed|null
     */
    public function featuredPhoto($size = 'thumbnail')
    {
        $photos = $this->marketingPhotos($size);

        $collection = collect($photos);

        $photo = null;

        // Color specific outside shot.
        $photo = $collection->first(function ($photo) {
            return isset($photo->shot_code) && $photo->shot_code === 'KAD';
        });

        // Default shot.
        if (!$photo) {
            $photo = $collection->first(function ($photo) {
                return isset($photo->shot_code) && $photo->shot_code === '116';
            });
        }

        // We probably have real photos. use the first one
        if (!$photo && isset($photos[0])) {
            $photo = $photos[0];
        }

        if ($photo) {
            $photo->url = generate_asset_url($photo->url, $size);
        }

        return $photo;
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
                if (!isset($source->{$field->base_field}) || !$source->{$field->base_field}) {
                    if (app()->bound('sentry')) {

                        if (isset($source->{$field->base_field})) {
                            $message = "Price Calculations: Base field not found in source pricing";
                        } else {
                            $message = "Price Calculations: No base field set";
                        }

                        app('sentry')->captureMessage($message, [], [
                            'extra' => [
                                'Deal ID' => $this->id,
                                'Dealer ID' => $dealer->id,
                                'Role' => $attr,
                                'Missing Field' => $field->base_field,
                            ],
                        ]);
                    }
                    continue;
                }

                $prices[$attr] = $source->{$field->base_field};

                if ($field->rules) {
                    foreach ($field->rules as $rule) {
                        //
                        // Conditions
                        if (isset($rule->conditions)) {
                            if ($rule->conditions->vin && $rule->conditions->vin != $this->vin) {
                                continue;
                            }

                            if ($rule->conditions->make && $rule->conditions->make != $this->make) {
                                continue;
                            }

                            if ($rule->conditions->model && $rule->conditions->model != $this->model) {
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
        $record['status'] = $this->status;

        $filterColor = null;
        if (isset(\DeliverMyRide\Fuel\Map::COLOR_MAP[$this->color])) {
            $filterColor = \DeliverMyRide\Fuel\Map::COLOR_MAP[$this->color];
            $dealFeatureColor = Feature::where('title', $filterColor)->first();
            if ($dealFeatureColor) {
                $record['vehicle_color'] = $dealFeatureColor->title;
            }
        }

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
        foreach ($this->marketingPhotos('full') as $photo) {
            $record['photos'][] = $photo->toArray();
        }

        $thumbnail = $this->featuredPhoto();
        $record['thumbnail'] = ($thumbnail ? $thumbnail->toArray() : null);
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
        if ($version) {
            $version = $version->toArray();
            unset($version['model']);
            unset($version['quotes']);
            unset($version['updated_at']);
            unset($version['created_at']);
            unset($version['segment']);
            unset($version['transmission_type']);
            unset($version['model_id']);
            unset($version['msrp']);
            unset($version['invoice']);
            unset($version['is_current']);
            unset($version['jato_model_id']);
            unset($version['jato_uid']);
            unset($version['jato_vehicle_id']);
            unset($version['delivery_price']);
            $record['version'] = $version;
        } else {
            $record['version'] = null;
        }

        $dealer = $this->dealer->toArray();
        unset($dealer['price_rules']);
        unset($dealer['max_delivery_miles']);
        unset($dealer['longitude']);
        unset($dealer['latitude']);
        unset($dealer['address']);
        unset($dealer['city']);
        unset($dealer['contact_email']);
        unset($dealer['contact_name']);
        unset($dealer['contact_title']);
        unset($dealer['contact_title']);
        unset($dealer['created_at']);
        unset($dealer['phone']);
        unset($dealer['route_one_id']);
        unset($dealer['state']);
        unset($dealer['updated_at']);
        unset($dealer['zip']);
        $record['dealer'] = $dealer;

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
            $data = $feature->toArray();
            unset($data['pivot']);
            unset($data['created_at']);
            unset($data['created_at']);
            unset($data['updated_at']);
            $record['jato_features'][] = $data;
        }

        return $record;
    }
}

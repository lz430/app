<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\JATO\Option;
use App\Models\JATO\Version;
use Backpack\CRUD\CrudTrait;
use ScoutElastic\Searchable;
use App\DealIndexConfigurator;
use App\Models\JATO\Equipment;
use App\Models\Order\Purchase;
use Illuminate\Database\Eloquent\Model;
use DeliverMyRide\Fuel\Map as ColorMaps;
use Illuminate\Database\Eloquent\Builder;
use DeliverMyRide\JATO\Manager\BuildOverviewData;
use DeliverMyRide\JATO\Manager\BuildEquipmentData;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\Deal.
 *
 * @property int $id
 * @property string $file_hash
 * @property int $dealer_id
 * @property Dealer $dealer
 * @property string $stock_number
 * @property string $vin
 * @property bool $new
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
 * @property bool|null $certified
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
 * @property \Illuminate\Support\Carbon|null $photos_updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Equipment[] $equipment
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Option[] $options
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\StandardText[] $standard_text
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Deal wherePhotosUpdatedAt($value)
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

    private const INDEX_MAKE_MAP = [
        'Infiniti' => 'INFINITI',
    ];

    private const INDEX_SERIES_MAP = [
        'Grand Cherokee' => [
            '2BC' => 'Upland',
            '2BZ' => 'Altitude',
            '2BS' => 'High Altitude',
            '2BE' => 'Loredo',
            '2BH' => 'Limited',
            '2BP' => 'Overland',
            '2BR' => 'Summit',
            '2BJ' => 'Trailhawk',
            '2XV' => 'Trackhawk',
        ],
    ];

    /**
     * @var array
     */
    protected $mapping = [
        'properties' => [
            'search' => [
                'type' => 'object',
                'properties' => [
                    'make' => [
                        'type' => 'text',
                        'term_vector' => 'yes',
                        'analyzer' => 'ngram_analyzer',
                        'search_analyzer' => 'ngram_analyzer',
                    ],
                    'model' => [
                        'type' => 'text',
                        'term_vector' => 'yes',
                        'analyzer' => 'ngram_analyzer',
                        'search_analyzer' => 'ngram_analyzer',
                    ],
                    'style' => [
                        'type' => 'text',
                        'term_vector' => 'yes',
                        'analyzer' => 'ngram_analyzer',
                        'search_analyzer' => 'ngram_analyzer',
                    ],
                ],
            ],
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
                        'type' => 'long',
                    ],
                    'thumbnail' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 512,
                            ],
                        ],
                    ],
                    'title' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                ],
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
                'type' => 'integer',
            ],
            'options' => [
                'type' => 'nested',
                'properties' => [
                    'option_name' => [
                        'type' => 'text',
                    ],
                    'option_code' => [
                        'type' => 'text',
                    ],
                    'msrp' => [
                        'type' => 'double',
                    ],
                    'invoice_price' => [
                        'type' => 'double',
                    ],
                ],
            ],
            'packages' => [
                'type' => 'nested',
                'properties' => [
                    'option_name' => [
                        'type' => 'text',
                    ],
                    'option_code' => [
                        'type' => 'text',
                    ],
                    'msrp' => [
                        'type' => 'double',
                    ],
                    'invoice_price' => [
                        'type' => 'double',
                    ],
                ],
            ],
            'equipment' => [
                'type' => 'nested',
                'properties' => [
                    'category' => [
                        'type' => 'text',
                    ],
                    'label' => [
                        'type' => 'text',
                    ],
                    'value' => [
                        'type' => 'text',
                    ],
                    'option_code' => [
                        'type' => 'text',
                    ],
                ],
            ],
            'overview' => [
                'type' => 'nested',
                'properties' => [
                    'category' => [
                        'type' => 'text',
                    ],
                    'label' => [
                        'type' => 'text',
                    ],
                    'value' => [
                        'type' => 'text',
                    ],
                ],
            ],
            'highlights' => [
                'type' => 'nested',
                'properties' => [
                    'category' => [
                        'type' => 'text',
                    ],
                    'label' => [
                        'type' => 'text',
                    ],
                    'value' => [
                        'type' => 'text',
                    ],
                ],
            ],
        ],
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

    public function getEquipment()
    {
        $codes = array_merge(
            $this->package_codes ? $this->package_codes : [],
            $this->option_codes ? $this->option_codes : []
        );

        //
        // Standard Equipment
        $query = Equipment::where('version_id', '=', $this->version_id);
        $query = $query->whereIn('availability', ['standard', '-']);

        $equipmentOnDeal = $query->get()->keyBy(function ($equipment) {
            return (string) $equipment->slug();
        });

        //
        // Optional Equipment
        if (count($codes)) {
            $query = Equipment::where('version_id', '=', $this->version_id);
            $options = Option::whereIn('option_code', $codes)
                ->get()
                ->pluck('option_id');
            $query = $query->where('availability', '=', 'optional');
            $query = $query->whereIn('option_id', $options);
            $optionalEquipment = $query->get()->keyBy(function ($equipment) {
                return $equipment->slug();
            });
        } else {
            $optionalEquipment = collect([]);
        }

        // Collect->merge is supposed to return the same amount, but doesn't seem to work correctly.
        $mergedEquipment = collect(array_merge($equipmentOnDeal->all(), $optionalEquipment->all()));

        return $mergedEquipment;
    }

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
    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class);
    }

    private function getRealPhotos()
    {
        $photos = $this->photos()->get();
        if (count($photos) <= 1) {
            return [];
        }

        $photos->shift();
        $photos[0]->thumbnail = generate_asset_url($photos[0]->url, 'thumbnail');

        return $photos;
    }

    /**
     * @param bool $accurate
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getColorStockPhotos($accurate = true)
    {
        if ($accurate) {
            $photos = $this->version->photos()
                ->where('type', '=', 'color')
                ->where('color', '=', $this->color)
                ->orderBy('shot_code')
                ->get();
        } else {
            $photos = $this->version->photos()
                ->where('type', '=', 'color')
                ->where('color_simple', '=', $this->simpleExteriorColor())
                ->orderBy('color')->orderBy('shot_code')
                ->limit(3)->get();
        }

        if (! count($photos)) {
            return $photos;
        }

        $last = $photos->pop();
        $last->thumbnail = generate_asset_url($last->url, 'thumbnail');
        $photos->push($last);

        $genericPhotos = $this->getGenericStockPhotos(false);
        $photos = $photos->merge($genericPhotos);

        return $photos;
    }

    /**
     * @param bool $thumbnail
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getGenericStockPhotos($thumbnail = true)
    {
        $photos = $this->version->photos()
            ->where('type', '=', 'default')
            ->orderBy('shot_code')
            ->get();

        if (! count($photos)) {
            return $photos;
        }

        if ($thumbnail) {
            $thumbnailFound = false;
            foreach ($photos as &$photo) {
                if (isset($photo->shot_code) && $photo->shot_code === '116') {
                    $photo->thumbnail = generate_asset_url($photo->url, 'thumbnail');
                    $thumbnailFound = true;
                }
            }

            if (! $thumbnailFound) {
                $photos[0]->thumbnail = generate_asset_url($photos[0]->url, 'thumbnail');
            }
        }

        return $photos;
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
            if ($group !== 'real' && ! $this->version) {
                continue;
            }

            switch ($group) {
                case 'real':
                    $photos = $this->getRealPhotos();
                    break;
                case 'stock_accurate':
                    $photos = $this->getColorStockPhotos(true);
                    break;

                case 'stock_simple':
                    $photos = $this->getColorStockPhotos(false);
                    break;

                case 'stock_default':
                    $photos = $this->getGenericStockPhotos();

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
        if (! is_array($photos) || ! count($photos)) {
            $photos = $this->marketingPhotos($size);
        }

        //
        // Only the featured photo has a thumbnail.
        return collect($photos)->first(function ($photo) {
            return isset($photo->thumbnail);
        });
    }

    /**
     * @return null|string
     */
    public function simpleExteriorColor(): ?string
    {
        if (! $this->color) {
            return null;
        }

        if (isset(ColorMaps::COLOR_MAP[$this->color])) {
            return ColorMaps::COLOR_MAP[$this->color];
        }

        foreach (ColorMaps::COLOR_MAP as $key => $value) {
            if (str_contains($this->color, $key)) {
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
        return implode(' ', [
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
        if (! $source) {
            $source = (object) [
                'msrp' => $this->msrp,
                'price' => $this->price,
            ];
        }

        if (! isset($source->msrp) || ! $source->msrp) {
            $source->msrp = $this->msrp;
        }

        if (! isset($source->price) || ! $source->price) {
            $source->price = ($this->price ? $this->price : $this->msrp);
        }

        // The defaults when no rules exist.
        // The default for 'pricing_is_valid' will be added to the object
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
                if ((! isset($field->base_field) || ! $field->base_field) || (! isset($source->{$field->base_field}) || ! $source->{$field->base_field})) {
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

        return (object) array_map('floatval', $prices);
    }

    /*
     * @Return array (true/false)
      Pricing validation -
      – Default price must be less than or equal to config('dmr.pricing_validation_percentage')
      – Default price must be greater than or equal to config('dmr.minimum_price_allowed')
      – MSRP must be greater or equal to Default price
      - Default price should be within % of MSRP that is set in the config/dmr.php file
     */
    public function validateDealPriceRules($prices)
    {
        if ($prices->msrp < $prices->default) {
            return [
                'isPricingValid' => false,
                'reason' => 'Price > MSRP',
            ];
        }
        if ($prices->default > config('dmr.pricing.maximum_allowed')) {
            return [
                'isPricingValid' => false,
                'reason' => 'Price > $'.number_format(config('dmr.pricing.maximum_allowed'), 2),
            ];
        }
        if ($prices->default < config('dmr.minimum_price_allowed')) {
            return [
                'isPricingValid' => false,
                'reason' => 'Price < $'.number_format(config('dmr.pricing.minimum_allowed'), 2),
            ];
        }
        if ((($prices->msrp - $prices->default) / $prices->msrp * 100) > config('dmr.pricing.validation_percentage')) {
            return [
                'isPricingValid' => false,
                'reason' => 'MSRP Exceeds Price by '.config('dmr.pricing.validation_percentage').'%',
            ];
        }

        return [
            'isPricingValid'=>true,
            'reason' => 'All Good',
        ];
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
        if (! $this->dealer) {
            return false;
        }

        if (! $this->features->count()) {
            return false;
        }

        return true;
    }

    public function shouldBeSearchable()
    {
        $shouldIndex = $this->shouldIndex();
        if (! $shouldIndex) {
            $this->unsearchable();
        }

        return $shouldIndex;
    }

    private function translateIndexMake()
    {
        $make = $this->version->model->make->name;

        if (isset(self::INDEX_MAKE_MAP[$make])) {
            $make = self::INDEX_MAKE_MAP[$make];
        }

        return $make;
    }

    private function translateIndexSeries()
    {
        $series = $this->version->trim_name;
        $model = $this->version->model->name;

        if (isset(self::INDEX_SERIES_MAP[$model]) && $this->option_codes && count($this->option_codes)) {
            foreach ($this->option_codes as $code) {
                if (isset(self::INDEX_SERIES_MAP[$model][$code])) {
                    return self::INDEX_SERIES_MAP[$model][$code];
                }
            }
        }

        return $series;
    }

    private function translateSearchableData()
    {
        $data = [
            'make' => array_unique([
                $this->version->model->make->name,
                $this->translateIndexMake(),
            ]),
            'model' => [
                $this->version->model->name,
                $this->version->model->make->name.' '.$this->version->model->name,
            ],
            'style' => array_merge(
                [$this->version->style()],
                $this->version->styleSynonyms()
            ),
        ];

        return $data;
    }

    /*
     *
     */

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

        //
        // Vehicle identification information
        $record['vin'] = $this->vin;
        $record['stock'] = $this->stock_number;
        $record['title'] = $this->title();

        //
        // Vehicle type
        $record['year'] = $this->year;
        $record['make'] = $this->translateIndexMake();
        $record['model'] = $this->version->model->name;
        $record['model_code'] = $this->model_code;
        $record['series'] = $this->translateIndexSeries();
        $record['style'] = $this->version->style();
        $record['seating_capacity'] = ($this->seating_capacity ? $this->seating_capacity : null);

        // name is confusing. This is the simple (filterable) value
        // in the sidebar.
        $record['vehicle_color'] = $this->simpleExteriorColor();

        $record['search'] = $this->translateSearchableData();

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

        $record['category'] = (object) [
            'id' => $this->version->model->id,
            'title' => implode(' ', [
                $record['make'],
                $record['model'],
            ]),
            'thumbnail' => ($this->version->thumbnail() ? generate_asset_url($this->version->thumbnail()->url) : null),
        ];

        //
        // Delivery Info
        $record['location'] = (object) [
            'lat' => $this->dealer->latitude,
            'lon' => $this->dealer->longitude,
        ];

        $record['max_delivery_distance'] = (float) $this->dealer->max_delivery_miles;

        //
        // Features
        foreach ($this->features()->where('is_active', '=', 1)->get() as $feature) {
            if (! isset($record[$feature->category->slug]) || ! is_array($record[$feature->category->slug])) {
                $record[$feature->category->slug] = [];
            }

            $record[$feature->category->slug][] = $feature->title;
        }

        $pricing = $this->prices();
        $record['pricing'] = $pricing;
        // Perform validation in the Prising array.
        $record['price_validation'] = $this->validateDealPriceRules($pricing);

        $record['payments'] = $this->payments;
        $record['fees'] = [
            'acquisition' => (float) $this->dealer->acquisition_fee,
            'cvr' => (float) $this->dealer->cvr_fee,
            'doc' => (float) $this->dealer->doc_fee,
            'registration' => (float) $this->dealer->registration_fee,
        ];

        $version = $this->version;
        $record['version'] = null;
        if ($version) {
            $record['version'] = $version->toIndexData();
        }

        $record['dealer'] = $this->dealer->toIndexData();

        $record['options'] = [];
        if ($this->option_codes != null) {
            foreach ($this->version->options()->where('option_type', 'O')->whereIn('option_code', $this->option_codes)->get() as $option) {
                $record['options'][] = [
                    'option_name' => $option->option_name,
                    'option_code' => $option->option_code,
                    'msrp' => $option->msrp,
                    'invoice_price' => $option->invoice_price,
                ];
            }
        }

        $record['packages'] = [];
        if ($this->package_codes != null) {
            foreach ($this->version->options()->where('option_type', 'P')->whereIn('option_code', $this->package_codes)->get() as $package) {
                $record['packages'][] = [
                    'option_name' => $package->option_name,
                    'option_code' => $package->option_code,
                    'msrp' => $package->msrp,
                    'invoice_price' => $package->invoice_price,
                ];
            }
        }

        $equipmentOnDeal = $this->getEquipment();
        $dealDetailData = new BuildOverviewData();

        // Highlights data for detail page above overview
        $record['highlights'] = [];
        $record['highlights'] = $dealDetailData->getHighlightsData($equipmentOnDeal, $this);

        // Overview data for detail page
        $record['overview'] = [];
        $record['overview'] = $dealDetailData->getOverviewData($equipmentOnDeal, $this);

        // Equipment on car
        $record['equipment'] = [];
        $record['equipment'] = (new BuildEquipmentData())->build($equipmentOnDeal, $this);

        //
        // Catchall
        if ($this->vauto_features) {
            $record['misc'] = [];
            $misc = explode('|', $this->vauto_features);
            $misc = array_map('trim', $misc);
            $record['misc'] = $misc;
        }

        return $record;
    }
}

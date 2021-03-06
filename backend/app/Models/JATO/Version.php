<?php

namespace App\Models\JATO;

use App\Models\Deal;
use DeliverMyRide\JATO\Map;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\JATO\Version.
 *
 * @property int $id
 * @property int $jato_vehicle_id
 * @property string $body_style
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property int $jato_uid
 * @property int $jato_model_id
 * @property string $year
 * @property string|null $name
 * @property string $trim_name
 * @property string $description
 * @property string|null $driven_wheels
 * @property int $doors
 * @property string $transmission_type
 * @property float|null $msrp
 * @property float|null $invoice
 * @property string|null $cab
 * @property string|null $segment
 * @property int|null $fuel_econ_city
 * @property int|null $fuel_econ_hwy
 * @property string|null $manufacturer_code
 * @property float|null $delivery_price
 * @property int $is_current
 * @property int $model_id
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @property-read \App\Models\JATO\VehicleModel $model
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\VersionPhoto[] $photos
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\VersionQuote[] $quotes
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereBodyStyle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereCab($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereDeliveryPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereDoors($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereDrivenWheels($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereFuelEconCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereFuelEconHwy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereInvoice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereIsCurrent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereJatoModelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereJatoUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereJatoVehicleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereManufacturerCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereModelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereMsrp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereSegment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereTransmissionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereTrimName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version whereYear($value)
 * @mixin \Eloquent
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Equipment[] $equipment
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Option[] $options
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\StandardText[] $standard_text
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Version query()
 */
class Version extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'msrp' => 'float',
        'invoice' => 'float',
        'fuel_econ_city' => 'integer',
        'fuel_econ_hwy' => 'integer',
    ];

    public function model()
    {
        return $this->belongsTo(VehicleModel::class, 'model_id');
    }

    /**
     * @return HasMany
     */
    public function photos(): HasMany
    {
        return $this->hasMany(VersionPhoto::class);
    }

    /**
     * @return HasMany
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(VersionQuote::class);
    }

    /**
     * @return HasMany
     */
    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    /**
     * @return HasMany
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class, 'version_id', 'id');
    }

    /**
     * @return HasMany
     */
    public function options(): HasMany
    {
        return $this->hasMany(Option::class, 'version_id', 'id');
    }

    /**
     * @return HasMany
     */
    public function standard_text(): HasMany
    {
        return $this->hasMany(StandardText::class, 'version_id', 'id');
    }

    /**
     * Human title for vehicle.
     * @return string
     */
    public function title(): string
    {
        return implode(' ', [
            $this->year,
            $this->model->make->name,
            $this->model->name,
            $this->trim_name,
        ]);
    }

    /**
     * @param bool $allow_last_year
     * @return VersionPhoto|null
     */
    public function thumbnail($allow_last_year = true): ?VersionPhoto
    {
        $thumbnail = $this->photos()
            ->where('shot_code', '=', '116')
            ->where('type', '=', 'default')
            ->first();

        // Only allow us to go back one year.
        if (! $thumbnail && $allow_last_year) {
            $oldVersion = self::where('year', '=', (int) $this->year - 1)
                ->where('model_id', '=', $this->model->id)
                ->has('photos')
                ->first();
            if ($oldVersion) {
                $thumbnail = $oldVersion->thumbnail(false);
            }
        }

        return $thumbnail;
    }

    public function styleSynonyms()
    {
        $style = $this->style();

        if (isset(Map::BODY_STYLE_SYNONYMS[$style])) {
            return Map::BODY_STYLE_SYNONYMS[$style];
        }

        return [];
    }

    public function style()
    {
        if (isset(Map::BODY_STYLE_MAP[$this->body_style])) {
            return Map::BODY_STYLE_MAP[$this->body_style];
        }
    }

    /**
     * @return array
     */
    public function toIndexData() : array
    {
        $data = $this->toArray();
        unset($data['model']);
        unset($data['quotes']);
        unset($data['options']);
        unset($data['updated_at']);
        unset($data['created_at']);
        unset($data['segment']);
        unset($data['transmission_type']);
        unset($data['model_id']);
        unset($data['msrp']);
        unset($data['invoice']);
        unset($data['is_current']);
        unset($data['jato_model_id']);
        unset($data['jato_uid']);
        unset($data['jato_vehicle_id']);
        unset($data['delivery_price']);
        unset($data['fuel_econ_city']);
        unset($data['fuel_econ_hwy']);
        unset($data['driven_wheels']);
        unset($data['doors']);
        unset($data['cab']);
        unset($data['body_style']);

        return $data;
    }
}

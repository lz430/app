<?php

namespace App\Models\JATO;
use DeliverMyRide\JATO\Map;
use App\Models\Deal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $jato_vehicle_id
 * @property string $body_style
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
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

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    /**
     * Human title for vehicle.
     * @return string
     */
    public function title(): string
    {
        return implode(" ", [
            $this->year,
            $this->model->make->name,
            $this->model->name,
            $this->trim_name,
        ]);
    }

    /**
     * @return VersionPhoto|null
     */
    public function thumbnail(): ?VersionPhoto {
        return  $this->photos()
            ->where('shot_code', '=', '116')
            ->where('color', '=', 'default')
            ->first();
    }

    public function style() {
        if (isset(Map::BODY_STYLE_MAP[$this->body_style])) {
            return Map::BODY_STYLE_MAP[$this->body_style];
        }
        return null;
    }
}

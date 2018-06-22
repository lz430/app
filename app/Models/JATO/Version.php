<?php

namespace App\Models\JATO;
use DeliverMyRide\JATO\Manager\Maps;
use App\Models\Deal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $jato_vehicle_id
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
     * @return VersionPhoto|null
     */
    public function thumbnail(): ?VersionPhoto {
        return  $this->photos()
            ->where('shot_code', '=', '116')
            ->where('color', '=', 'default')
            ->first();
    }

    public function style() {
        if (isset(Maps::BODY_STYLE_MAP[$this->body_style])) {
            return Maps::BODY_STYLE_MAP[$this->body_style];
        }
        return null;
    }
}

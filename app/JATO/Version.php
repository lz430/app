<?php

namespace App\JATO;

use App\VersionDeal;
use Illuminate\Database\Eloquent\Model;

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

    public function options()
    {
        return $this->hasMany(Option::class, 'jato_vehicle_id');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'jato_vehicle_id', 'jato_vehicle_id');
    }

    public function taxesAndDiscounts()
    {
        return $this->hasMany(VersionTaxAndDiscount::class);
    }

    public function deals()
    {
        return $this->hasMany(VersionDeal::class);
    }
}

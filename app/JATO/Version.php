<?php

namespace App\JATO;

use App\VersionDeal;
use DeliverMyRide\HasOptions;
use Illuminate\Database\Eloquent\Model;

class Version extends Model implements HasOptions
{
    protected $fillable = [
        'jato_vehicle_id',
        'jato_uid',
        'jato_model_id',
        'year',
        'name',
        'trim_name',
        'description',
        'driven_wheels',
        'doors',
        'transmission_type',
        'msrp',
        'invoice',
        'body_style',
        'photo_path',
        'fuel_econ_city',
        'fuel_econ_hwy',
        'manufacturer_code',
        'delivery_price',
        'is_current',
    ];

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
        return $this->hasMany(VersionOption::class);
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

<?php

namespace App\JATO;

use App\VersionDeal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
    
    public function scopeFilterByBodyStyle(Builder $query, $bodyStyles) : Builder
    {
        if (! is_array($bodyStyles)) {
            $bodyStyles = [$bodyStyles];
        }
        
        return $query->whereIn(
            DB::raw('lower(body_style)'),
            array_map('strtolower', $bodyStyles)
        );
    }
}

<?php

namespace App\JATO;

use App\Deal;
use DeliverMyRide\JATO\BodyStyles;
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
        return $this->belongsToMany(Deal::class);
    }

    public function scopeFilterByModel(Builder $query, array $modelIds) : Builder
    {
        return $query->whereIn('model_id', $modelIds);
    }

    public function scopeFilterByBodyStyle(Builder $query, $bodyStyles) : Builder
    {
        if (! is_array($bodyStyles)) {
            $bodyStyles = [$bodyStyles];
        }

        /**
         * Add subStyles (Sub-categories of body styles)
         */
        $bodyStylesWithSubStyles = array_map(
            'strtolower',
            array_reduce($bodyStyles, function ($acc, $bodyStyle) {
                return array_merge($acc, BodyStyles::ALL[strtolower($bodyStyle)]['subStyles'] ?? []);
            }, $bodyStyles)
        );

        return $query->whereIn(
            DB::raw('lower(body_style)'),
            array_map('strtolower', $bodyStylesWithSubStyles)
        );
    }
}

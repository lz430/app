<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    protected $fillable = [
        'name',
        'url_name',
        'is_current',
    ];

    public function makes()
    {
        return $this->hasMany(Make::class);
    }

    public function models()
    {
        return $this->hasManyThrough(VehicleModel::class, Make::class, 'model_id');
    }
}

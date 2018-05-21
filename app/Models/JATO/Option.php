<?php

namespace App\Models\JATO;

use App\SavedVehicle;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $guarded = [];

    protected $casts = [
        'msrp' => 'float',
        'invoice' => 'float',
    ];

    public function version()
    {
        return $this->belongsTo(Version::class, 'jato_vehicle_id');
    }

    public function savedVehicle()
    {
        return $this->hasManyThrough(SavedVehicle::class, Version::class, 'version_id', 'version_id', 'jato_vehicle_id');
    }
}

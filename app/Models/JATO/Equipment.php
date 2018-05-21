<?php

namespace App\Models\JATO;

use App\SavedVehicle;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $guarded = ['id'];

    public function version()
    {
        return $this->belongsTo(Version::class, 'jato_vehicle_id');
    }

    public function option()
    {
        return $this->belongsTo(Option::class, 'jato_option_id');
    }

    public function savedVehicle()
    {
        return $this->hasManyThrough(SavedVehicle::class, Version::class, 'version_id', 'version_id', 'jato_vehicle_id');
    }
}

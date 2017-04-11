<?php

namespace App\JATO;

use App\SavedVehicle;
use Illuminate\Database\Eloquent\Model;

class VersionOption extends Model
{
    protected $fillable = [
        'name',
        'state',
        'description',
        'jato_option_id',
        'option_code',
        'option_type',
        'msrp',
        'discount',
        'invoice',
        'jato_vehicle_id',
    ];

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function savedVehicle()
    {
        return $this->belongsToMany(SavedVehicle::class);
    }
}

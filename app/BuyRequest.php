<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BuyRequest extends Model
{
    protected $fillable = [
        'user_id',
        'saved_vehicle_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savedVehicle()
    {
        return $this->belongsTo(SavedVehicle::class);
    }
}

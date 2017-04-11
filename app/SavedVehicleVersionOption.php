<?php

namespace App;

use App\JATO\VersionOption;
use Illuminate\Database\Eloquent\Model;

class SavedVehicleVersionOption extends Model
{
    public function savedVehicle()
    {
        return $this->belongsTo(SavedVehicle::class);
    }

    public function option()
    {
        return $this->belongsTo(VersionOption::class);
    }
}

<?php

namespace App;

use App\JATO\Version;
use App\JATO\VersionOption;
use Illuminate\Database\Eloquent\Model;

class SavedVehicle extends Model
{
    protected $fillable = [
        'name',
        'jato_vehicle_id',
        'jato_uid',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function options()
    {
        return $this->belongsToMany(VersionOption::class)->withTimestamps();
    }
}

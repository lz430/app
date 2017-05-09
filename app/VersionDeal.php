<?php

namespace App;

use App\JATO\Version;
use DeliverMyRide\HasOptions;
use Illuminate\Database\Eloquent\Model;

class VersionDeal extends Model implements HasOptions
{
    protected $guarded = [];
    protected $dates = ['inventory_date'];

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function options()
    {
        return $this->hasMany(VersionDealOption::class);
    }

    public function photos()
    {
        return $this->hasMany(VersionDealPhoto::class);
    }
}

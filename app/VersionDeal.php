<?php

namespace App;

use App\JATO\Version;
use Illuminate\Database\Eloquent\Model;

class VersionDeal extends Model
{
    protected $guarded = [];
    protected $dates = ['inventory_date'];

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function photos()
    {
        return $this->hasMany(VersionDealPhoto::class);
    }
}

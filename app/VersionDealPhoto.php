<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VersionDealPhoto extends Model
{
    protected $fillable = ['url'];

    public function deal()
    {
        return $this->belongsTo(VersionDeal::class);
    }
}

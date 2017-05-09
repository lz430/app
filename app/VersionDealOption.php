<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VersionDealOption extends Model
{
    protected $fillable = ['option'];

    public function deal()
    {
        return $this->belongsTo(VersionDeal::class);
    }
}

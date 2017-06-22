<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DealPhoto extends Model
{
    protected $fillable = ['url'];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}

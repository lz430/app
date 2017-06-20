<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DealOption extends Model
{
    protected $fillable = ['option'];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}

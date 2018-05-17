<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DealOption extends Model
{
    protected $fillable = ['option'];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}

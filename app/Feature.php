<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = ['feature'];
    
    public function deals()
    {
        return $this->belongsToMany(VersionDeal::class);
    }
}

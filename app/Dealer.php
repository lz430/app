<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    protected $guarded = ['id'];

    public function deals()
    {
        return $this->hasMany(
            Deal::class,
            'dealer_id',
            'dealer_id'
        );
    }
}

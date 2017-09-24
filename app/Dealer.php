<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'dealer_id',
        'latitude',
        'longitude',
        'name',
        'max_delivery_miles',
        'route_one_id',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'contact_name',
        'contact_title'
    ];

    public function deals()
    {
        return $this->hasMany(
            Deal::class,
            'dealer_id',
            'dealer_id'
        );
    }
}

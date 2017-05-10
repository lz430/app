<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    
    protected $fillable = [
        'name', 'email', 'password',
    ];
    
    protected $hidden = [
        'password', 'remember_token',
    ];
    
    public function savedVehicles()
    {
        return $this->hasMany(SavedVehicle::class);
    }
    
    public function buyRequest()
    {
        return $this->hasMany(BuyRequest::class);
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($user) {
            $user->api_token = str_random(60);
        });
    }
}

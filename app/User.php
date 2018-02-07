<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    
    protected $fillable = [
        'drivers_license_number', 'drivers_license_state', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'zip',
    ];
    
    protected $hidden = [
        'password', 'remember_token',
    ];
    
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($user) {
            $user->api_token = str_random(60);
        });
    }
}

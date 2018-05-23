<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Backpack\CRUD\CrudTrait;


/**
 * @property int $id
 * @property string first_name
 * @property string last_name
 * @property string email
 * @property string zip
 *
 * @property string password
 * @property string remember_token
 * @property string api_token
 * @property string phone_number
 * @property string drivers_license_number
 * @property string drivers_license_state
 *
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 */
class User extends Authenticatable
{
    use Notifiable;
    use CrudTrait;


    /**
     * @var array
     */
    protected $fillable = [
        'drivers_license_number',
        'drivers_license_state',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'zip',
    ];

    /**
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchases() : HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     *
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->api_token = str_random(60);
        });
    }

    /**
     * Send the password reset notification.
     *
     * @param string $token
     *
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        /*
        $this->notify(new ResetPasswordNotification($token));
        */
    }
}

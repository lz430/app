<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailLogin extends Model
{
    protected $fillable = ['email', 'token'];

    public function user()
    {
        return $this->hasOne(User::class, 'email', 'email');
    }
}

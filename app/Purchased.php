<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Purchased extends Model
{
    protected $table = 'purchased';
    
    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
    
    public function buyer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

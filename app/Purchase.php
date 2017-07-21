<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    public const CASH = 'cash';
    public const FINANCE = 'finance';
    public const LEASE = 'lease';
    protected $guarded = [
        'id',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
    
    public function buyer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

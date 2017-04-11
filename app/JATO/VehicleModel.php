<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class VehicleModel extends Model
{
    protected $fillable = [
        'name',
        'url_name',
        'is_current',
    ];

    public function make()
    {
        return $this->belongsTo(Make::class);
    }

    public function versions()
    {
        return $this->hasMany(Version::class, 'model_id');
    }
}

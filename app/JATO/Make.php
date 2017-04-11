<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    protected $fillable = [
        'name',
        'url_name',
        'is_current',
    ];

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function models()
    {
        return $this->hasMany(VehicleModel::class, 'make_id');
    }
}

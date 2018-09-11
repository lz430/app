<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Builder;
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

    public function scopeFilterByMake(Builder $query, $makes) : Builder
    {
        if (! is_array($makes)) {
            $makes = [$makes];
        }
        
        return $query->whereIn('make_id', $makes);
    }
}

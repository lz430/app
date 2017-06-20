<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    public const GROUPS = [
        self::GROUP_SAFETY,
        self::GROUP_SEATING,
    ];
    public const GROUP_SAFETY = 'safety';
    public const GROUP_SEATING = 'seating';
    
    protected $fillable = ['feature', 'group'];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }
    
    public function scopeHasGroup($query)
    {
        return $query->whereNotNull('group');
    }

    public static function getGroupForFeature(string $feature)
    {
        if (str_contains($feature, [
            'airbag',
            'brake',
            'Blind Spot Sensor',
            'Rear Parking Sensors',
            'anti-roll',
            'roll-over protection',
            'camera',
        ])) {
            return self::GROUP_SAFETY;
        } elseif (str_contains($feature, [
            'seat',
            'lumbar',
        ])) {
            return self::GROUP_SEATING;
        }

        return null;
    }
}

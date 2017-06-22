<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    public const GROUPS = [
        self::GROUP_SAFETY,
        self::GROUP_SEATING,
        self::GROUP_TECHNOLOGY,
        self::GROUP_TRUCK,
        self::COMFORT_AND_CONVENIENCE,
    ];
    public const GROUP_SAFETY = 'safety';
    public const GROUP_SEATING = 'seating';
    public const GROUP_TECHNOLOGY = 'technology';
    public const GROUP_TRUCK = 'truck';
    public const COMFORT_AND_CONVENIENCE = 'comfort and convenience';

    protected $fillable = ['feature', 'group'];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }
    
    public function scopeHasGroup($query)
    {
        return $query->whereNotNull('group');
    }

    public static function getGroupForFeature(string $featureString)
    {
        $feature = strtolower($featureString);

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
        } elseif (str_contains($feature, [
            'technology',
            'audio'
        ])) {
            return self::GROUP_TECHNOLOGY;
        } elseif (str_contains($feature, [
            'bed'
        ])) {
            return self::GROUP_TRUCK;
        } elseif (str_contains($feature, [
            'power'
        ])) {
            return self::COMFORT_AND_CONVENIENCE;
        }

        return null;
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JatoFeature extends Model
{
    public const WHITELIST = [
        'Side airbags front',
        'Side airbags rear',
        'Collision warning system',
        'Lane departure warning',
        'Rear parking distance sensors',
        'Front parking distance sensors',
        'Side parking distance sensors',
        'Blind spot warning sensor',
        'Electronic traction control',
        'Power adjustable front seats driver',
        'Power adjustable front seats passenger',
        'Heated front seats driver',
        'Heated front seats passenger',
        'Heated rear seats',
        'Power folding rear seats',
        'Heated steering wheel',
        'Climate controlled front seats driver',
        'Climate controlled front seats passenger',
        'Rear climate control',
        '12V power outlet front',
        '12V power outlet rear',
        'Power adjustable steering wheel',
        'Satellite radio',
        'Navigation system',
        'Rear entertainment display middle',
        'Rear entertainment display back of front seats',
        'Front entertainment display',
        'USB connection front',
        'USB connection rear',
        'Bluetooth phone connection',
        'Bluetooth music streaming',
        'Wifi network',
        'HUD',
        'Navigation via mobile phone',
        'Front sunroof',
        'Rear sunroof',
        'Glass roof',
        'Trailer hitch assist',
        '2 Door',
        '3 Door',
        '4 Door',
        'Regular Cab',
        'Extended Cab',
        'Crew Cab',
    ];

    public const GROUPS = [
        self::GROUP_SAFETY,
        self::GROUP_SEATING,
        self::GROUP_TECHNOLOGY,
        self::GROUP_TRUCK,
        self::COMFORT_AND_CONVENIENCE,
        self::POWERTRAIN,
    ];
    public const GROUP_SAFETY = 'safety';
    public const GROUP_SEATING = 'seating';
    public const GROUP_TECHNOLOGY = 'technology';
    public const GROUP_TRUCK = 'truck';
    public const COMFORT_AND_CONVENIENCE = 'comfort and convenience';
    public const POWERTRAIN = 'powertrain';

    protected $fillable = ['feature', 'content', 'group'];

    protected $table = 'features';

    public function deals()
    {
        return $this->belongsToMany(Deal::class, 'deal_feature', 'feature_id', 'deal_id');
    }
    
    public function scopeHasGroup($query)
    {
        return $query->whereNotNull('group');
    }
}

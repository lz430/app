<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\JatoFeature
 *
 * @property int $id
 * @property string $feature
 * @property string|null $content
 * @property string|null $group
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature hasGroup()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereFeature($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JatoFeature whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class JatoFeature extends Model
{
    // No longer in use except by seeder
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

    public const SYNC_GROUPS = [
        ['title' => 'safety', 'id' => 11],
        ['title' => self::GROUP_SEATING_KEY, 'id' => 9],
        ['title' => 'comfort and convenience', 'id' => 1],
        ['title' => 'technology', 'id' => 8],
        ['title' => 'engine', 'id' => 3],
        ['title' => 'exterior', 'id' => 4],
        ['title' => 'fuel economy', 'id' => 5],
        ['title' => 'general', 'id' => 6],
        ['title' => 'interior', 'id' => 9],
        ['title' => 'suspension', 'id' => 12],
        ['title' => 'transmission', 'id' => 13],
    ];

    public const GROUP_TRUCK_KEY = 'truck';
    public const GROUP_SEATING_KEY = 'seating';

    protected $fillable = ['feature', 'content', 'group'];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }

    public function scopeHasGroup($query)
    {
        return $query->whereNotNull('group');
    }

    /**
     * @return array
     */
    public function toIndexData() : array
    {
        $data = $this->toArray();
        unset($data['pivot']);
        unset($data['created_at']);
        unset($data['created_at']);
        unset($data['updated_at']);
        return $data;
    }
}

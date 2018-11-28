<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 * App\Models\JATO\VehicleModel.
 *
 * @property int $id
 * @property string $name
 * @property string $url_name
 * @property int $is_current
 * @property int $make_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\JATO\Make $make
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Version[] $versions
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel filterByMake($makes)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereIsCurrent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereMakeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VehicleModel whereUrlName($value)
 * @mixin \Eloquent
 */
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

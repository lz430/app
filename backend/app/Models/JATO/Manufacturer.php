<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\JATO\Manufacturer.
 *
 * @property int $id
 * @property string $name
 * @property string $url_name
 * @property int $is_current
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Make[] $makes
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\VehicleModel[] $models
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereIsCurrent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Manufacturer whereUrlName($value)
 * @mixin \Eloquent
 */
class Manufacturer extends Model
{
    protected $fillable = [
        'name',
        'url_name',
        'is_current',
    ];

    public function makes()
    {
        return $this->hasMany(Make::class);
    }

    public function models()
    {
        return $this->hasManyThrough(VehicleModel::class, Make::class, 'model_id');
    }
}

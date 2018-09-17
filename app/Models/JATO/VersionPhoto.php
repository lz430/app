<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * Note: this is not specifically a JATO model. the data is pulled from the Fuel api.
 * 
 * but we pull the photos using jato information and we associate the photos with
 * jato vehicles so that we can reuse the information for deals that share the same jato vehicle.
 *
 * @property int $id
 * @property string $url
 * @property string $shot_code
 * @property string $color
 * @property Version $version
 * @property int|null $version_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereShotCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereVersionId($value)
 * @mixin \Eloquent
 */
class VersionPhoto extends Model
{
    protected $table = 'versions_photos';
    protected $guarded = ['id'];

    /**
     * @return BelongsTo
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }
}

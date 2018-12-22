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
 * @property string $type
 * @property string $description
 * @property string $shot_code
 * @property string $color
 * @property string $color_simple
 * @property string $color_rgb
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
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereColorRgb($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereColorSimple($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionPhoto whereType($value)
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

    /**
     * @return array
     */
    public function toIndexData() : array
    {
        $data = $this->toArray();
        unset($data['id']);
        unset($data['created_at']);
        unset($data['updated_at']);
        unset($data['version_id']);

        return $data;
    }
}

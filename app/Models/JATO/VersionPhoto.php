<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * Note: this is not specifically a JATO model. the data is pulled from the Fuel api.
 * but we pull the photos using jato information and we associate the photos with
 * jato vehicles so that we can reuse the information for deals that share the same jato vehicle.
 *
 * @property int $id
 * @property string $url
 * @property string $shot_code
 * @property string $color
 * @property Version $version
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

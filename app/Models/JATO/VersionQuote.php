<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * Note: this is not specifically a JATO model. The data is pulled form the RIS api.
 *
 * @property int $id
 * @property string $hashcode
 * @property string $make_hashcode
 * @property int $strategy
 * @property int $term
 * @property int $rebate
 * @property int $rate
 * @property \stdClass $data
 * @property Version $version
 */
class VersionQuote extends Model
{
    protected $table = 'versions_quotes';
    protected $guarded = ['id'];


    protected $casts = [
        'data' => 'object',
    ];

    /**
     * @return BelongsTo
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }
}

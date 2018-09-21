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
 * @property int $version_id
 * @property int|null $residual
 * @property int|null $miles
 * @property string|null $rate_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereHashcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereMakeHashcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereMiles($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereRateType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereRebate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereResidual($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereStrategy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereTerm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\VersionQuote whereVersionId($value)
 * @mixin \Eloquent
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

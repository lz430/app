<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\JATO\Option
 *
 * @property int $id
 * @property int $version_id
 * @property int $option_id
 * @property string $option_code
 * @property string $option_type
 * @property float $msrp
 * @property float $invoice_price
 * @property string $option_name
 * @property string $option_state_name
 * @property string $option_state
 * @property string $option_description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @property-read \App\Models\JATO\Version $version
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereInvoicePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereMsrp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionState($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionStateName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereOptionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Option whereVersionId($value)
 * @mixin \Eloquent
 */
class Option extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'version_id',
        'option_id',
        'option_code',
        'option_type',
        'msrp',
        'invoice_price',
        'option_name',
        'option_state_name',
        'option_state',
        'option_description'
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }
}

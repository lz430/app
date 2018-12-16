<?php

namespace App\Models;

use Backpack\CRUD\CrudTrait;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\DealerContact
 *
 * @property int $id
 * @property string|null $dealer_id
 * @property string|null $phone
 * @property string|null $name
 * @property string|null $email
 * @property string|null $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereDealerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealerContact whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DealerContact extends Model
{
    use CrudTrait;

    /**
     * @var array
     */
    protected $fillable = [
        'dealer_id',
        'phone',
        'email',
        'name',
        'title',
        'created_at',
        'updated_at',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Backpack\CRUD\CrudTrait;


/**
 * @property int $id
 * @property string $dealer_id
 * @property boolean $is_active
 * @property  \stdClass $price_rules
 * @property $acquisition_fee
 * @property $doc_fee
 * @property $registration_fee
 * @property $cvr_fee
 * @property string route_one_id
 */
class Dealer extends Model
{
    use CrudTrait;

    /**
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * @var array
     */
    protected $casts = [
        'price_rules' => 'object',
    ];


    /**
     * @var array
     */
    protected $fillable = [
        'is_active',
        'dealer_id',
        'latitude',
        'longitude',
        'name',
        'acquisition_fee',
        'registration_fee',
        'doc_fee',
        'cvr_fee',
        'max_delivery_miles',
        'route_one_id',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'contact_email',
        'contact_name',
        'contact_title',
        'price_rules',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function deals() : HasMany
    {
        return $this->hasMany(
            Deal::class,
            'dealer_id',
            'dealer_id'
        );
    }
}

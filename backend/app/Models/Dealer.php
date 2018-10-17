<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Backpack\CRUD\CrudTrait;


/**
 * App\Models\Dealer
 *
 * @property int $id
 * @property string $dealer_id
 * @property boolean $is_active
 * @property \stdClass $price_rules
 * @property $acquisition_fee
 * @property $doc_fee
 * @property $registration_fee
 * @property $cvr_fee
 * @property float $latitude
 * @property float $longitude
 * @property string $name
 * @property int $max_delivery_miles
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $route_one_id
 * @property string|null $address
 * @property string|null $city
 * @property string|null $state
 * @property string|null $zip
 * @property string|null $phone
 * @property string|null $contact_name
 * @property string|null $contact_email
 * @property string|null $contact_title
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deal[] $deals
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereAcquisitionFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereContactEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereContactName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereContactTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereCvrFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereDealerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereDocFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereMaxDeliveryMiles($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer wherePriceRules($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereRegistrationFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereRouteOneId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Dealer whereZip($value)
 * @mixin \Eloquent
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
        'notification_emails' => 'object',
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
        'money_factor',
        'notification_emails',
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

    public function contacts(): HasMany
    {
        return $this->hasMany(DealerContact::class, 'dealer_id', 'dealer_id');
    }
}

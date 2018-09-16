<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * App\Models\Purchase
 *
 * @property int $id
 * @property int $user_id
 * @property User $buyer
 * @property int $deal_id
 * @property Deal $deal
 * @property \stdClass $rebates
 * @property float $down_payment
 * @property float $monthly_payment
 * @property int $term
 * @property int $lease_mileage
 * @property float $amount_financed
 * @property float $dmr_price
 * @property string $application_status
 * @property string $type
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property \DateTime $completed_at
 * @property float|null $msrp
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereAmountFinanced($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereApplicationStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereDmrPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereDownPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereLeaseMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereMonthlyPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereMsrp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereRebates($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereTerm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase whereUserId($value)
 * @mixin \Eloquent
 */
class Purchase extends Model
{
    public const CASH = 'cash';
    public const FINANCE = 'finance';
    public const LEASE = 'lease';

    /**
     * @var array
     */
    protected $guarded = [
        'id',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'rebates' => 'object',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function deal() : BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function buyer() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Sum total rebates
     *
     * @return float
     */
    public function rebatesTotalValue() : float
    {
        $total = 0;
        if ($this->rebates && $this->rebates->total) {
            $total = $this->rebates->total;
        }
        return $total;
    }

    /**
     * Return rebates as human friendly string
     *
     * @return string
     */
    public function rebatesAsTitle() : string
    {
        $title = [];

        if (is_array($this->rebates)) {
            foreach ($this->rebates as $rebate) {
                $title[] = ucwords(strtolower($rebate->title));
            }
        }

        if (count($title)) {
            return implode(', ', $title);
        }

        return '';
    }

    public function isCash() : bool
    {
        return $this->type === self::CASH;
    }

    public function isFinance() : bool
    {
        return $this->type === self::FINANCE;
    }

    public function isLease() : bool
    {
        return $this->type === self::LEASE;
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * @property int $id
 * @property int $user_id
 * @property User $buyer
 * @property int $deal_id
 * @property Deal $deal
 *
 * @property \stdClass $rebates
 * @property float $down_payment
 * @property float $monthly_payment
 * @property int $term
 * @property float $amount_financed
 * @property float $dmr_price
 * @property string $application_status
 * @property string $type
 *
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property \DateTime $completed_at
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

        if (is_array($this->rebates)) {
            foreach ($this->rebates as $rebate) {
                $total += $rebate->value;
            }
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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\DealPhoto
 *
 * @property int $id
 * @property int $deal_id
 * @property string $url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Deal $deal
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealPhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealPhoto whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealPhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealPhoto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\DealPhoto whereUrl($value)
 * @mixin \Eloquent
 */
class DealPhoto extends Model
{
    protected $fillable = ['url'];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
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
        return $data;
    }
}

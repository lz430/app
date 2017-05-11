<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class VersionTaxAndDiscount extends Model
{
    protected $table = 'version_taxes_and_discounts';

    protected $fillable = [
        'name',
        'amount',
    ];

    protected $casts = [
        'amount' => 'float',
    ];
}

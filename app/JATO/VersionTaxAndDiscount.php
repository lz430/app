<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class VersionTaxAndDiscount extends Model
{
    protected $table = 'versions_taxes_and_discounts';
    protected $fillable = [
        'name',
        'amount'
    ];
}

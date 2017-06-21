<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Incentive extends Model
{
    protected $guarded = ['id'];
    protected $dates = [
        'validFrom',
        'validTo',
        'revisionDate',
    ];
}

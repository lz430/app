<?php

namespace App;

use App\JATO\Version;
use Illuminate\Database\Eloquent\Model;

class Incentive extends Model
{
    protected $guarded = ['id'];
    protected $dates = [
        'validFrom',
        'validTo',
        'revisionDate',
    ];

    public function versions()
    {
        return $this->belongsToMany(
            Version::class
        );
    }
}

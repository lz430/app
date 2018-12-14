<?php

namespace App\Models;

use Backpack\CRUD\CrudTrait;
use Illuminate\Database\Eloquent\Model;

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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Backpack\CRUD\CrudTrait;

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
        'updated_at'
    ];
}
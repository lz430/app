<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DmrCategory extends Model
{
    protected $fillable = ['title', 'slug', 'select_one_dmr_feature', 'display_order'];
}

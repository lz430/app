<?php

namespace App;

use App\JATO\Version;
use Illuminate\Database\Eloquent\Model;

class SavedVehicle extends Model
{
    protected $fillable = [
        'version_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function version()
    {
        return $this->belongsTo(Version::class);
    }
}

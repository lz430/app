<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UserPasswordReset.
 *
 * @property int $id
 * @property string $email
 * @property string $token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\UserPasswordReset whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class UserPasswordReset extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'password_resets';

    protected $fillable = [
        'email', 'token',
    ];
}

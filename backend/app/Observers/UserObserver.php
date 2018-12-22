<?php

namespace App\Observers;

use App\Mail\UserCreated;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class UserObserver
{
    /**
     * Handle to the user "created" event.
     *
     * @param User $user
     * @return void
     */
    public function created(User $user)
    {
        //
        // Send welcome email
        Mail::to($user->email)->send(new UserCreated($user));
    }
}

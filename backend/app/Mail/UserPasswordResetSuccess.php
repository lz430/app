<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserPasswordResetSuccess extends Mailable
{
    use Queueable, SerializesModels;

    const VIEW = 'emails.user-created';

    /**
     * The User instance.
     *
     * @var User
     */
    public $user;

    /**
     * UserCreated constructor.
     * @param User $User
     */
    public function __construct(User $User)
    {
        $this->user = $User;
    }

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->markdown(self::VIEW);
    }
}

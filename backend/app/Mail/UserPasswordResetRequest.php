<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserPasswordResetRequest extends Mailable
{
    use Queueable, SerializesModels;

    const VIEW = 'emails.user-created';

    /** @var User */
    public $user;

    public $token;

    /**
     * @param User $user
     * @param string $token
     */
    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->markdown(self::VIEW);
    }
}

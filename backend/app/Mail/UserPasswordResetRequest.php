<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserPasswordResetRequest extends Mailable
{
    use Queueable, SerializesModels;

    const VIEW = 'emails.user-password-reset-request';

    /** @var User */
    public $user;
    public $token;
    public $url;

    /**
     * @param User $user
     * @param string $token
     */
    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->token = $token;
        $this->url = config('app.marketing_url').'/forgot/change?'.build_query_string(['token' => $token, 'email' => $user->email]);
    }

    public function build()
    {
        return $this
            ->subject('Password Reset Request')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->markdown(self::VIEW);
    }
}

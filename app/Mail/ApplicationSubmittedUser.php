<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationSubmittedUser extends Mailable
{
    use Queueable, SerializesModels;

    const VIEW = 'emails.application-submitted-user';

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->markdown(self::VIEW);
    }
}

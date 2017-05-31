<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DealPurchasedUser extends Mailable
{
    use Queueable, SerializesModels;

    const VIEW = 'emails.deal-purchased-user';

    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->markdown(self::VIEW);
    }
}

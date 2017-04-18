<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendGarageLink extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function build()
    {
        $this->from('noreply@delivermyride.com', config('name'));
        $this->subject(config('name') . ' Garage');

        return $this->view('auth.emails.email-login');
    }
}

<?php

namespace App\Mail;

use App\SavedVehicle;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendUserBuyRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $savedVehicle;

    public function __construct(SavedVehicle $savedVehicle)
    {
        $this->savedVehicle = $savedVehicle;
    }

    public function build()
    {
        $this->from('noreply@delivermyride.com', config('name'));
        $this->subject(config('name') . ' Buy Request');

        return $this->view('buyRequest.emails.user-buy-request');
    }
}

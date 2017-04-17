<?php

namespace App\Http\Controllers\Auth;

use App\EmailLogin;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    protected $redirectTo = '/home';

    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }

    public function login()
    {
        $this->validate(request(), ['email' => 'required|email|exists:users']);

        $emailLogin = EmailLogin::createForEmail(request()->input('email'));

        $url = route('auth.email-authenticate', [
            'token' => $emailLogin->token
        ]);

        Mail::send('auth.emails.email-login', ['url' => $url], function (Message $message) {
            $message->from('noreply@delivermyride.com', config('name'));
            $message->to(request()->input('email'))->subject(config('name') . ' Garage');
        });

        return 'Login email sent. Go check your email.';
    }

    public function authenticateEmail($token)
    {
        $emailLogin = EmailLogin::validFromToken($token);

        Auth::login($emailLogin->user);

        return redirect('home');
    }
}

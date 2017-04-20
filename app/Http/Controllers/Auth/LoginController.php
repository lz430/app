<?php

namespace App\Http\Controllers\Auth;

use App\EmailLogin;
use App\Http\Controllers\Controller;
use App\Mail\SendGarageLink;
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

        Mail::to(request()->input('email'))->send(new SendGarageLink($url));

        return view('auth.login-email-sent');
    }

    public function authenticateEmail($token)
    {
        $emailLogin = EmailLogin::validFromToken($token);

        auth()->login($emailLogin->user);

        EmailLogin::where('email', $emailLogin->email)->delete();

        return redirect('home');
    }
}

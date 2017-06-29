<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    use AuthenticatesUsers;
    
    protected $redirectTo = '/';
    
    public function __construct()
    {
        $this->middleware(['guest', 'intended'])->except('logout');
    }

    protected function authenticated(Request $request, $user)
    {
        if ($request->session()->has('intended') && in_array($request->session()->get('intended'), [
                'filter'
            ])) {
            $this->redirectTo = $request->session()->get('intended');
        }
    }
}

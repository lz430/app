<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IntendedPageAuth
{
    public function handle(Request $request, Closure $next, $guard = null)
    {
        if ($request->has('intended')) {
            $request->session()->put('intended', $request->get('intended'));
        }

        return $next($request);
    }
}

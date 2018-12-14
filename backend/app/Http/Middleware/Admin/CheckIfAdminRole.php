<?php

namespace App\Http\Middleware\Admin;

use Auth;
use Closure;

class CheckIfAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::guest()) {
            abort(403);
        }

        //check permission
        if (config('app.env') != 'local' && ! $request->user()->can('use administration area')) {
            abort(403);
        }

        return $next($request);
    }
}

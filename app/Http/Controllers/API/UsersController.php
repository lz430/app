<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Transformers\UserTransformer;
use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends Controller
{
    const RESOURCE_NAME = 'users';
    const TRANSFORMER = UserTransformer::class;
    
    public function store(Request $request)
    {
        $this->validate($request, ['email' => 'required|email|unique:users']);
        
        $user = User::create([
            'email' => request()->input('email'),
            'name' => '',
            'password' => bcrypt(str_random(8)),
        ]);
        
        return fractal()
            ->item($user)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond(Response::HTTP_CREATED);
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Transformers\UserTransformer;
use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends BaseAPIController
{
    const RESOURCE_NAME = 'users';
    const TRANSFORMER = UserTransformer::class;
    
    public function store(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|max:255|unique:users',
            'phone_number' => 'required|max:255',
        ]);
        
        $user = User::create([
            'email' => request('email'),
            'name' => request('name'),
            'phone_number' => request('phone_number'),
            'password' => bcrypt(str_random(8)),
        ]);
        
        return fractal()
            ->item($user)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond(Response::HTTP_CREATED);
    }
    
    public function update(Request $request, User $user)
    {
        if (auth()->user()->cant('update', $user)) {
            return $this->respondForbidden('You do not have access to modify this resource.');
        }

        $this->validate($request, [
            'email' =>  'email|max:255|unique:users',
            'name' => 'string',
        ]);
        
        $user->update($request->intersect(['email', 'name']));
    
        return fractal()
            ->item($user)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}

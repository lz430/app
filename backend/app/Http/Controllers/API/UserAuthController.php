<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class UserAuthController extends BaseAPIController
{
    /**
     * Create user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registration(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = new User([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->save();

        return response()->json(
            [
                'message' => 'Successfully created user!',
            ],
            201
        );
    }

    /**
     * Login user and create token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);

        $credentials = request(['email', 'password']);
        $token = Auth::attempt($credentials);

        if (! $token) {
            return $this->respondWithGlobalFormError('Email and password combination incorrect');
        }

        return response()->json($this->buildTokenResponse($token));
    }

    /**
     * Logout user (Revoke the token).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        //$request->user()->token()->revoke();
        Auth::logout();

        return response()->json(
            [
                'message' => 'Successfully logged out',
            ]
        );
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Get the token array structure.
     * @param $token
     * @return array
     */
    protected function buildTokenResponse($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Mail\UserPasswordResetRequest;
use App\Mail\UserPasswordResetSuccess;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\UserPasswordReset;
use Illuminate\Support\Facades\Hash;


class UserPasswordResetController extends BaseAPIController
{

    /**
     * Create token password reset
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(
                [
                    'message' => 'We can\'t find a user with that e-mail address.'
                ],
                404);
        }

        $passwordReset = UserPasswordReset::updateOrCreate(
            [
                'email' => $user->email
            ],
            [
                'email' => $user->email,
                'token' => str_random(60)
            ]
        );

        if ($user && $passwordReset) {
            $user->notify(
                new UserPasswordResetRequest($user, $passwordReset->token)
            );
        }

        return response()->json([
            'message' => 'We have e-mailed your password reset link!'
        ]);

    }

    /**
     * @param $token
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function find($token)
    {
        $passwordReset = UserPasswordReset::where('token', $token)
            ->first();

        if (!$passwordReset) {
            return response()->json(
                [
                    'message' => 'This password reset token is invalid.'
                ],
                404);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json(
                [
                    'message' => 'This password reset token is invalid.'
                ],
                404);
        }

        return response()->json($passwordReset);
    }

    /**
     * Reset password
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);

        $passwordReset = UserPasswordReset::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();

        if (!$passwordReset) {
            return response()->json(
                [
                    'message' => 'This password reset token is invalid.'
                ],
                404);
        }


        $user = User::where('email', $passwordReset->email)->first();
        if (!$user) {
            return response()->json(
                [
                    'message' => 'We can\'t find a user with that e - mail address . '
                ],
                404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $passwordReset->delete();
        $user->notify(new UserPasswordResetSuccess($user));

        return response()->json($user);
    }
}
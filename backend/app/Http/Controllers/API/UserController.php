<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserPasswordResetSuccess;

class UserController extends BaseAPIController
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Reset password.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function update(Request $request)
    {
        $request->validate([
            'password' => 'required|string|confirmed',
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();
        Mail::to($user->email)->send((new UserPasswordResetSuccess($user)));

        return response()->json(
            [
                'message' => 'Password Changed',
            ]
        );
    }
}

<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserPasswordResetSuccess;
use App\Models\User;

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
            'email' => 'required|string|email',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'sometimes|string',
            'current_password' => 'sometimes|string',
            'password' => 'required_with:current_password|string|confirmed',
        ]);

        $user = $request->user();

        //
        // Update email
        if ($user->email !== $request->get('email')) {
            $isEmailInUse = User::where('email', '=', $request->get('email'))->count();
            if ($isEmailInUse) {
                return $this->respondWithGlobalFormError("Email address already in use");
            }
        }

        $input = $request->only('first_name', 'last_name', 'email', 'phone');
        $user->update($input);

        //
        // Update Password
        if ($request->get('current_password', false)) {
            if (!Hash::check($request->get('current_password', false), $user->password)) {
                return $this->respondWithGlobalFormError("Current password is incorrect");
            }

            $user->password = Hash::make($request->password);
        }

        $user->save();
        return response()->json($user);
    }
}

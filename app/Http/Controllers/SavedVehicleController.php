<?php

namespace App\Http\Controllers;

use App\SavedVehicle;
use App\User;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SavedVehicleController extends Controller
{
    public function store()
    {
        /** @var \App\User $user */
        $user = User::firstOrCreate([
            'email' => request()->input('email'),
        ], [
            'email' => request()->input('email'),
            'name' => '',
            'password' => Hash::make(str_random(8))
        ]);

        /** @var SavedVehicle $savedVehicle */
        $savedVehicle = SavedVehicle::create([
            'user_id' => $user->id,
            'version_id' => request()->input('version_id')
        ]);

        $savedVehicle->options()->sync(request()->input('option_ids'));

        Mail::send('auth.emails.email-login', ['url' => route('home')], function (Message $message) {
            $message->from('noreply@delivermyride.com', config('name'));
            $message->to(request()->input('email'))->subject(config('name') . ' Garage');
        });

        Auth::loginUsingId($user->id);

        return redirect()->to('home');
    }

    public function destroy($id)
    {
        Auth::user()->savedVehicles()->findOrFail($id)->delete();

        return redirect()->back();
    }
}

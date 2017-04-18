<?php

namespace App\Http\Controllers;

use App\Mail\EmailLoginMailable;
use App\SavedVehicle;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SavedVehicleController extends Controller
{
    public function index()
    {
        return view('home')->with('savedVehicles', Auth::user()->savedVehicles);
    }

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

        Mail::to(request()->input('email'))->send(new EmailLoginMailable(route('home')));

        Auth::loginUsingId($user->id);

        return redirect()->to('home');
    }

    public function destroy($id)
    {
        Auth::user()->savedVehicles()->findOrFail($id)->delete();

        return redirect()->back();
    }
}

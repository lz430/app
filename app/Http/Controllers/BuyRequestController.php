<?php

namespace App\Http\Controllers;

use App\Mail\SendRepBuyRequest;
use App\Mail\SendUserBuyRequest;
use App\SavedVehicle;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class BuyRequestController extends Controller
{
    public function store()
    {
        // TODO: we will get much more information about the user before doing this

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

        Mail::to(config('mail.rep-email'))->send(new SendRepBuyRequest($savedVehicle));
        Mail::to($user->email)->send(new SendUserBuyRequest($savedVehicle));

        return redirect()->to(route('buyRequest.thanks'));
    }

    public function thanks()
    {
        return view('buyRequest.thanks');
    }
}

<?php

namespace App\Http\Controllers;

use App\BuyRequest;
use App\Mail\SendRepBuyRequest;
use App\Mail\SendUserBuyRequest;
use App\SavedVehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BuyRequestController extends Controller
{
    public function create(Request $request)
    {
        $this->validate(request(), [
            'savedVehicleId' => 'required|exists:saved_vehicles,id'
        ]);

        $savedVehicle = SavedVehicle::with(
            'version.taxesAndDiscounts',
            'options'
        )->findOrFail(request('savedVehicleId'));

        return view('buyRequest.create')
            ->with('savedVehicleId', $savedVehicle->id)
            ->with('selectedOptions', $savedVehicle->options)
            ->with('selectedOptionIds', $savedVehicle->options->pluck('id'))
            ->with('version', $savedVehicle->version);
    }

    public function store()
    {
        $this->validate(request(), [
            'savedVehicleId' => 'required|exists:saved_vehicles,id',
        ]);

        $savedVehicle = SavedVehicle::findOrFail(request('savedVehicleId'));

        // TODO: get more info about user required to make purchase

        BuyRequest::create([
            'user_id' => auth()->user()->id,
            'saved_vehicle_id' => $savedVehicle->id,
        ]);

        Mail::to(config('mail.rep-email'))->send(new SendRepBuyRequest($savedVehicle));
        Mail::to(auth()->user()->email)->send(new SendUserBuyRequest($savedVehicle));

        return redirect()->to(route('buyRequest.thanks'));
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Models\Dealer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DealerContact;
use Carbon\Carbon;


class DealerContactsController extends Controller
{
    public function create($id)
    {
        $dealerNumber = Dealer::select('dealer_id')->where('id', $id)->first();
        return view('admin.dealer-contact', ['dealerNumber' => $dealerNumber->dealer_id]);
    }

    public function show(DealerContact $contact)
    {
        return view('admin.dealer-contact', ['contact' => $contact]);
    }

    public function save(Request $request)
    {
        $dealerContact = new DealerContact;

        if(isset($request->contact_id)) {
            $data = [
                'dealer_id' => $request->dealer_id,
                'name' => $request->name,
                'title' => $request->title,
                'email' => $request->email,
                'phone' => $request->phone,
            ];
            $dealerContact->find($request->contact_id)->update($data);
        } else {
            $dealerContact->name = $request->name;
            $dealerContact->title = $request->title;
            $dealerContact->email = $request->email;
            $dealerContact->phone = $request->phone;
            $dealerContact->dealer_id = $request->dealer_id;
            $dealerContact->save();
        }

        $findDealer = Dealer::where('dealer_id', $request->dealer_id)->first();
        return redirect('admin/dealer/' . $findDealer->id  . '/edit#contacts');
    }
}

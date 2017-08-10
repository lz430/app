<?php

namespace App\Http\Controllers\API;

use App\Purchase;
use App\User;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RouteOneWebhookController extends BaseAPIController
{
    public function handleWebhook(Request $request)
    {
        try {
            $this->validate(request(), [
                'payload' => 'required',
            ]);
            
            $xml = simplexml_load_string($request->get('payload'), null, null, "http://schemas.xmlsoap.org/soap/envelope/");
            $payload = json_decode(json_encode($xml->children('E', true)->Envelope->Body->children('B', true)), false);
            
            $email = $payload
                ->ProcessCreditDecision
                ->DataArea
                ->CreditDecision
                ->Detail
                ->IndividualApplicant
                ->Contact
                ->EMailAddress;
            
            // @todo check if the application was declined
            // @todo redirect the user to thank you page
            
            $user = User::where('email', '=', $email)->firstOrFail();
            $purchase = Purchase::where('user_id', $user->id)->orderBy('id', 'desc')->firstOrFail();
            $purchase->update(['completed_at' => Carbon::now()]);
        } catch (ValidationException | ModelNotFoundException $e) {
            Bugsnag::notifyException($e);
        }
        
        return response()->json(['status' => 'ok']);
    }
}

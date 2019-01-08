<?php

namespace App\Http\Controllers\API;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Order\Purchase;
use App\Events\UserDataChanged;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RouteOneWebhookController extends BaseAPIController
{
    public function handleWebhook(Request $request)
    {
        Log::channel('stderr')->info('Route-One-Webhook-Request', [$request]);

        if ($request->getContentType() !== 'xml') {
            return response()->json(['status' => 'error', 'message' => 'Invalid format. Please use XML.']);
        }

        try {
            $xml = simplexml_load_string($request->getContent(), null, null, 'http://schemas.xmlsoap.org/soap/envelope/');
            $payload = json_decode(json_encode($xml->Body->children('B', true)), false);

            $email = $payload
                ->ProcessCreditDecision
                ->DataArea
                ->CreditDecision
                ->Detail
                ->IndividualApplicant
                ->Contact
                ->EMailAddress;

            $applicationStatus = $payload
                ->ProcessCreditDecision
                ->DataArea
                ->CreditDecision
                ->Header
                ->ApplicationStatus ?? null;

            $user = User::where('email', '=', $email)->firstOrFail();
            $purchase = Purchase::where('user_id', $user->id)->orderBy('id', 'desc')->firstOrFail();
            $purchase->update([
                'completed_at' => Carbon::now(),
                'application_status' => $applicationStatus,
            ]);

            event(new UserDataChanged(['email' => $email, 'creditapproval' => $applicationStatus]));
        } catch (ValidationException | ModelNotFoundException $e) {
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }

            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

        return response()->json(['status' => 'ok']);
    }
}

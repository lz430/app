<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Services\Quote\DealQuote;
use App\Http\Controllers\Controller;

class DealFinancingController extends Controller
{
    private const ZIPCODE = '48116';
    private $deal;

    public function show(Deal $deal, DealQuote $dealQuoter)
    {
        $this->deal = $deal;

        $data = [
            'deal' => $deal,
            'quotes' => [],
        ];

        $paymentTypes = [
            'cash', 'finance', 'lease',
        ];

        $roles = [
            'default', 'employee', 'supplier',
        ];

        foreach ($paymentTypes as $type) {
            foreach ($roles as $role) {
                $quote = $dealQuoter->get(
                    $deal,
                    self::ZIPCODE,
                    $type,
                    [$role],
                   true
                );
                $data['quotes'][$type][$role] = $quote;
            }
        }

        return view('admin.deal-financing',
            $data
        );
    }
}

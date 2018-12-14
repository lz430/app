<?php

namespace DeliverMyRide\Carleton;

use Illuminate\Support\Facades\Log;

class Client
{
    private $url;
    private $username;
    private $password;

    /**
     * @param $url
     * @param $username
     * @param $password
     */
    public function __construct($url, $username, $password)
    {
        $this->url = $url;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * @param $cashDown
     * @param $terms
     * @param $taxRate
     * @param $acquisitionFee
     * @param $docFee
     * @param $rebate
     * @param $licenseFee
     * @param $cvrFee
     * @param $msrp
     * @param $cashAdvance
     * @param $contractDate
     * @param $tradeAllowance
     * @param $tradeLien
     * @return array
     */
    public function buildRequestParams(
        $cashDown,
        $terms,
        $taxRate,
        $acquisitionFee,
        $docFee,
        $rebate,
        $licenseFee,
        $cvrFee,
        $msrp,
        $cashAdvance,
        $contractDate,
        $tradeAllowance,
        $tradeLien)
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
            'quotes' => [],
        ];

        $fees = [
            'acquisition' => [
                'Amount' => (float) $acquisitionFee,
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => 1,
                'FinanceTaxes' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'doc' => [
                'Amount' => (float) $docFee,
                'Type' => 'Upfront',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => 1,
                'FinanceTaxes' => 'No',
                'RoundToOption' => 'NearestPenny',
            ],
            'rebate' => [
                'Amount' => -1 * abs($rebate),
                'Type' => 'AlternateTaxBase',
                'Base' => 'Fixed',
                'DescriptionType' => 'Rebate',
                'TaxIndex' => 1,
                'FinanceTaxes' => 'No',
                'CCRPortionFeeTaxed' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'cvr' => [
                'Amount' => (float) $cvrFee,
                'Type' => 'Upfront',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => 1,
                'FinanceTaxes' => 'No',
                'RoundToOption' => 'NearestPenny',
            ],
        ];

        foreach ($terms as $term => $termData) {
            $quote = [
                'taxRate' => $taxRate,
                'residualPercent' => $termData['residual'],
                'term' => $termData['length'],
                'annualMileage' => $termData['mileage'],
                'contractDate' => $contractDate->format('Y-m-d'),
                'msrp' => $msrp,
                'cashAdvance' => $cashAdvance,
                'fees' => $fees,
            ];

            if (isset($termData['rate'])) {
                $quote['rate'] = $termData['rate'];
            }

            if (isset($termData['moneyFactor'])) {
                $quote['moneyFactor'] = $termData['moneyFactor'];
            }

            $quote['fees']['cashDown'] = [
                'Amount' => -1 * abs($cashDown),
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'CashDown',
                'TaxIndex' => '1',
                'FinanceTaxes' => 'No',
                'CCRPortionFeeTaxed' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ];

            if ($tradeAllowance) {
                $quote['fees']['tradeAllowance'] = [
                    'Amount' => -1 * abs($tradeAllowance),
                    'Type' => 'None',
                    'Base' => 'Fixed',
                    'DescriptionType' => 'TradeAllowance',
                    'TaxIndex' => '1',
                    'FinanceTaxes' => 'No',
                    'CCRPortionFeeTaxed' => 'Yes',
                    'RoundToOption' => 'NearestPenny',
                ];
            }

            if ($tradeLien) {
                $quote['fees']['tradeLien'] = [
                    'Amount' => $tradeLien,
                    'Type' => 'None',
                    'Base' => 'Fixed',
                    'DescriptionType' => 'TradeLien',
                    'TaxIndex' => '1',
                    'FinanceTaxes' => 'No',
                    'CCRPortionFeeTaxed' => 'Yes',
                    'RoundToOption' => 'NearestPenny',
                ];
            }

            $data['quotes'][] = $quote;
        }

        return $data;
    }

    /**
     * @param $data
     * @return string
     * @throws \Throwable
     */
    public function buildRequest($data)
    {
        $contents = view('carleton.request', $data)->render();
        $contents = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n".$contents;
        $contents = trim(preg_replace('/\s+/', ' ', $contents));

        return $contents;
    }

    /**
     * @param $cashDown
     * @param $terms
     * @param $taxRate
     * @param $acquisitionFee
     * @param $docFee
     * @param $rebate
     * @param $licenseFee
     * @param $cvrFee
     * @param $msrp
     * @param $cashAdvance
     * @param null $contractDate
     * @param int $tradeAllowance
     * @param int $tradeLien
     * @return array
     * @throws CarletonDataException
     * @throws \Throwable
     */
    public function getLeasePaymentsFor(
        $cashDown,
        array $terms,
        $taxRate,
        $acquisitionFee,
        $docFee,
        $rebate,
        $licenseFee,
        $cvrFee,
        $msrp,
        $cashAdvance,
        $contractDate = null,
        $tradeAllowance = 0,
        $tradeLien = 0)
    {
        if (! $contractDate) {
            $contractDate = new \DateTime();
        }

        $params = $this->buildRequestParams(
            $cashDown,
            $terms,
            $taxRate,
            $acquisitionFee,
            $docFee,
            $rebate,
            $licenseFee,
            $cvrFee,
            $msrp,
            $cashAdvance,
            $contractDate,
            $tradeAllowance,
            $tradeLien
        );
        $request = $this->buildRequest($params);

        return $this->getLeasePaymentsForQuoteParameters($params, $request);
    }

    /**
     * @param $params
     * @param $request
     * @return array
     * @throws CarletonDataException
     */
    public function getLeasePaymentsForQuoteParameters($params, $request)
    {
        $headers = [
            'Content-Type: text/xml; charset="utf-8"',
            'Content-Length: '.strlen($request),
            'Accept: text/xml',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
            'SOAPAction: "http://www.carletoninc.com/calcs/lease/GetQuotes"',
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, 'DMR');

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);

        $data = curl_exec($ch);
        if ($data === false) {
            $error = curl_error($ch);
            Log::info(var_export($error, true));

            return [];
        }

        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($data);
        if ($xml === false) {
            app('sentry')->captureMessage('Invalid XML', [], [
                'extra' => [
                    'xml' => $data,
                ],
            ]);

            return [];
        }

        $xml->registerXPathNamespace('lease', 'http://www.carletoninc.com/calcs/lease');

        $faults = $xml->xpath('/soap:Envelope/soap:Body/soap:Fault');
        if ($faults) {
            Log::info('Could not find lease calculations (response): '.(string) $faults[0]->faultstring);

            return [];
        }

        $results = [];
        $quotes = $xml->xpath('/soap:Envelope/soap:Body/lease:GetQuotesResponse/lease:GetQuotesResult/lease:Quote');
        for ($i = 0; $i < count($quotes); $i++) {
            $quote = $quotes[$i];
            $input = $params['quotes'][$i];
            $results[$i] = [
                'term' => $input['term'],
                'cash_due' => (float) $input['fees']['cashDown']['Amount'],
                'annual_mileage' => $input['annualMileage'],
                'monthly_payment' => (float) sprintf('%.02f', $quote->RegularPayment),
                'cash_down_ccr' => (float) sprintf('%.02f', $quote->CashDownCCR),
                'total_amount_at_drive_off' => (float) sprintf('%.02f', $quote->TotalAmountAtDriveOff),
                'monthly_use_tax' => (float) sprintf('%.02f', $quote->MonthlyUseTax),
                'monthly_pre_tax_payment' => (float) sprintf('%.02f', $quote->TaxablePayment),
            ];
        }

        return $results;
    }
}

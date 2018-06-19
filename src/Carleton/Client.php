<?php

namespace DeliverMyRide\Carleton;

use Illuminate\Support\Facades\Cache;
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


    public function getLeasePaymentsFor(
        array $cashDueOptions,
        $terms,
        $taxRate,
        $acquisitionFee,
        $docFee,
        $rebate,
        $licenseFee,
        $cvrFee,
        $msrp,
        $cashAdvance,
        $contractDate = null
    ) {
        if (! $contractDate) {
            $contractDate = new \DateTime();
        }

        $cacheKey = implode('--', [
            implode('-', $cashDueOptions),
            $terms,
            $taxRate,
            $acquisitionFee,
            $docFee,
            $rebate,
            $licenseFee,
            $cvrFee,
            $msrp,
            $cashAdvance,
            $contractDate->format('Y-m-d'),
            'v2'
        ]);

        if (Cache::has($cacheKey)) {
            Log::debug("Cache HIT ($cacheKey)");
            return Cache::get($cacheKey);
        }

        Log::debug("Cache MISS ($cacheKey)");

        $quoteParameters = [];
        foreach ($cashDueOptions as $cashDue) {
            foreach (json_decode($terms, true) as $term => $termData) {
                $annualMileages = $termData['annualMileage'];
                foreach ($annualMileages as $annualMileage => $annualMileageData) {
                    $quoteParameter = QuoteParameters::create($contractDate)
                        ->withTaxRate($taxRate)
                        ->withAcquisitionFee($acquisitionFee)
                        ->withDocFee($docFee)
                        ->withCashDown($cashDue)
                        ->withRebate($rebate)
                        ->withLicenseFee($licenseFee)
                        ->withCvrFee($cvrFee)
                        ->withMsrp($msrp)
                        ->withCashAdvance($cashAdvance)
                        ->withMoneyFactor($termData['moneyFactor'])
                        ->withResidualPercentage($annualMileageData['residualPercent'])
                        ->withTerm($term)
                        ->withAnnualMileage($annualMileage);

                    $quoteParameters[] = $quoteParameter;
                }
            }
        }

        $leasePayments = $this->getLeasePaymentsForQuoteParameters($quoteParameters);

        Cache::put($cacheKey, $leasePayments, count($leasePayments) > 0 ? 360: 15);

        return $leasePayments;
    }

    /**
     * @param $quoteParameters QuoteParameters[]
     */
    public function getLeasePaymentsForQuoteParameters($quoteParameters)
    {
        $getQuotesTemplate = file_get_contents(resource_path('xml/carleton/GetQuotes.xml'));
        $quoteParametersTemplate = file_get_contents(resource_path('xml/carleton/QuoteParameters.xml'));

        $body = strtr($getQuotesTemplate, [
            '%USERNAME%' => $this->username,
            '%PASSWORD%' => $this->password,
            '%PARAMETERS%' => implode('', array_map(function (QuoteParameters $quoteParameters) use ($quoteParametersTemplate) {
                return $quoteParameters->transformTemplate($quoteParametersTemplate);
            }, $quoteParameters)),
        ]);

        $headers = [
            'Content-Type: text/xml; charset="utf-8"',
            'Content-Length: ' . strlen($body),
            'Accept: text/xml',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
            'SOAPAction: "http://www.carletoninc.com/calcs/lease/GetQuotes"'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, 'DMR');

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

        $data = curl_exec($ch);

        if ($data === false) {
            $error = curl_error($ch);
            Log::info(var_export($error, true));
            return [];
        }

        $xml = new \SimpleXMLElement($data);
        $xml->registerXPathNamespace('lease', 'http://www.carletoninc.com/calcs/lease');

        $faults = $xml->xpath('/soap:Envelope/soap:Body/soap:Fault');
        if ($faults) {
            Log::info('Could not find lease calculations (response): ' . (string)$faults[0]->faultstring);

            return [];
        }

        $results = [];
        $quotes = $xml->xpath('/soap:Envelope/soap:Body/lease:GetQuotesResponse/lease:GetQuotesResult/lease:Quote');

        for ($i = 0; $i < count($quotes); $i++) {
            $quote = $quotes[$i];
            $input = $quoteParameters[$i];

            $results[$i] = [
                'term' => $input->getTerm(),
                'cash_due' => (float)$input->getCashDown(),
                'annual_mileage' => $input->getAnnualMileage(),
                'monthly_payment' => (float)sprintf("%.02f", $quote->RegularPayment),
                'total_amount_at_drive_off' => (float)sprintf("%.02f", $quote->TotalAmountAtDriveOff),
            ];
        }

        return $results;
    }
}

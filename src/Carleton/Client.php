<?php

namespace DeliverMyRide\Carleton;

use Illuminate\Support\Facades\Log;

class Client
{
    /**
     * @param $quoteParameters QuoteParameters[]
     */
    public function getLeasePaymentsFor($quoteParameters)
    {
        $url = config('services.carleton.url');
        $username = config('services.carleton.username');
        $password = config('services.carleton.password');

        $getQuotesTemplate = file_get_contents(resource_path('xml/carleton/GetQuotes.xml'));
        $quoteParametersTemplate = file_get_contents(resource_path('xml/carleton/QuoteParameters.xml'));

        $body = strtr($getQuotesTemplate, [
            '%USERNAME%' => $username,
            '%PASSWORD%' => $password,
            '%PARAMETERS%' => implode('', array_map(function (QuoteParameters $quoteParameters) use ($quoteParametersTemplate) {
                return $quoteParameters->transformTemplate($quoteParametersTemplate);
            }, $quoteParameters)),
        ]);

        $headers = array(
            'Content-Type: text/xml; charset="utf-8"',
            'Content-Length: '.strlen($body),
            'Accept: text/xml',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
            'SOAPAction: "http://www.carletoninc.com/calcs/lease/GetQuotes"'
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, 'DMR');

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

        $data = curl_exec($ch);

        $xml = new \SimpleXMLElement($data);
        $xml->registerXPathNamespace('lease', 'http://www.carletoninc.com/calcs/lease');


        $faults = $xml->xpath('/soap:Envelope/soap:Body/soap:Fault');
        if ($faults) {
            Log::info('Could not find lease calculations (response): ' . (string) $faults[0]->faultstring);

            return [];
        }

        $results = [];
        $quotes = $xml->xpath('/soap:Envelope/soap:Body/lease:GetQuotesResponse/lease:GetQuotesResult/lease:Quote');

        for ($i = 0; $i < count($quotes); $i++) {
            $quote = $quotes[$i];
            $input = $quoteParameters[$i];

            $results[$i] = [
                'term' => $input->getTerm(),
                'cash_down' => (float) $input->getCashDown(),
                'annual_mileage' => $input->getAnnualMileage(),
                'monthly_payment' => (float) sprintf("%.02f", $quote->RegularPayment),
                'total_amount_at_drive_off' => (float) sprintf("%.02f", $quote->TotalAmountAtDriveOff),
            ];
        }

        return $results;
    }
}

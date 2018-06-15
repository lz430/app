<?php

namespace DeliverMyRide\DataDelivery;

use DeliverMyRide\Common\ApiClient;
use GuzzleHttp\Psr7\Response;
use function GuzzleHttp\Psr7\stream_for;

/**
 * https://xmlasvr.aisrebates.com/ais_xml/test.html
 */
class DataDeliveryClient extends ApiClient
{
    /** @var string api key */
    protected $id;
    protected $apiKey;

    /** @var string baseUrl */
    protected $baseUrl;

    public $totalrate;
    public $programdata;

    /**
     * @param string $id
     * @param string $apiKey
     */
    public function __construct(string $id, string $apiKey)
    {
        parent::__construct();

        // Setup services
        $this->totalrate = new Service\TotalRateService($this);
        $this->programdata = new Service\ProgramDataService($this);

        // Configure
        $this->apiKey = $apiKey;
        $this->id = $id;
        $this->baseUrl = "https://xmlasvr.aisrebates.com/ais_xml/get_data.php";
    }

    protected function getRequestHeaders() {
        return [
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];
    }

    /**
     * Sends POST request.
     * @param string $endpoint
     * @param  $data
     * @param bool $async
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function post($endpoint, $data, bool $async = FALSE)
    {
        $data['CustomerID'] = $this->id;
        $data['WebPass'] = $this->apiKey;

        $response = $this->http_client->request('POST',
            "$this->baseUrl/$endpoint", [
                'form_params' => $data,
                'headers' => $this->getRequestHeaders()
            ]);
        return $this->handleResponse($response);
    }

    /**
     * @param Response $response
     * @param bool $async
     * @return mixed
     */
    public function handleResponse(Response $response)
    {
        $stream = stream_for($response->getBody());
        $data = $stream->getContents();
        $raw_response = simplexml_load_string($data);
        return $raw_response;
    }

}
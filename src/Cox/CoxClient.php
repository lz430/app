<?php

namespace DeliverMyRide\Cox;


use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use function GuzzleHttp\Psr7\stream_for;

/**
 * Class CoxClient
 * @package DeliverMyRide\Cox

 * @see https://incentives.homenetiol.com/v2.2/metadata
 *  For information about endpoints
 */
class CoxClient
{
    /** @var Client $http_client */
    private $http_client;

    /** @var string api key */
    protected $apiKey;

    /** @var string API environment */
    protected $environment;

    /** @var string baseUrl */
    protected $baseUrl;

    /** @var Service\TestService $test */
    public $test;

    /**
     * CoxClient constructor.
     * @param $apiKey
     */
    public function __construct(string $apiKey)
    {
        // Setup guzzle client
        $this->setDefaultClient();

        // Setup services
        $this->test = new Service\TestService($this);

        // Configure
        $this->apiKey = $apiKey;
        $this->baseUrl = "https://incentives.homenetiol.com/v2.2/json/reply";

    }

    /**
     *
     */
    private function setDefaultClient()
    {
        $this->http_client = new Client();
    }

    /**
     * Sets GuzzleHttp client.
     * @param Client $client
     */
    public function setClient($client)
    {
        $this->http_client = $client;
    }

    /**
     * Sends POST request to Cox API.
     * @param string $endpoint
     * @param string $json
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function post($endpoint, $json)
    {
        $response = $this->http_client->request('POST',
            "$this->baseUrl/$endpoint", [
                'json' => $json,
                'headers' => [
                    'Accept' => 'application/json',
                    'AIS-ApiKey' => $this->apiKey,
                ]
            ]);
        return $this->handleResponse($response);
    }

    /**
     * Sends PUT request to Cox API.
     * @param string $endpoint
     * @param string $json
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function put($endpoint, $json)
    {
        $response = $this->http_client->request('PUT',
            "$this->baseUrl/$endpoint", [
                'json' => $json,
                'headers' => [
                    'Accept' => 'application/json',
                    'AIS-ApiKey' => $this->apiKey,
                ]
            ]);
        return $this->handleResponse($response);
    }

    /**
     * Sends DELETE request to Cox API.
     * @param string $endpoint
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function delete($endpoint)
    {
        $response = $this->http_client->request('DELETE',
            "$this->baseUrl/$endpoint", [
                'headers' => [
                    'Accept' => 'application/json',
                    'AIS-ApiKey' => $this->apiKey,
                ]
            ]);
        return $this->handleResponse($response);
    }

    /**
     * @param string $endpoint
     * @param array $query
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get($endpoint, $query = [])
    {

        $response = $this->http_client->request('GET',
            "$this->baseUrl/$endpoint", [
                'query' => $query,
                'headers' => [
                    'Accept' => 'application/json',
                    'AIS-ApiKey' => $this->apiKey,
                ]
            ]);
        return $this->handleResponse($response);
    }

    /**
     * @param Response $response
     * @return mixed
     */
    private function handleResponse(Response $response)
    {
        $stream = stream_for($response->getBody());
        $raw_response = json_decode($stream->getContents());
        return $raw_response;
    }
}
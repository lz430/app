<?php

namespace DeliverMyRide\Common;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Promise\Promise;
use function GuzzleHttp\Psr7\stream_for;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

/**
 * Class ApiClient.
 */
class ApiClient
{
    /** @var Client $http_client */
    protected $http_client;

    /** @var string baseUrl */
    protected $baseUrl;

    /**
     * ApiClient constructor.
     */
    public function __construct()
    {
        // Setup guzzle client
        $this->setDefaultClient();
    }

    private function setDefaultClient()
    {
        $this->http_client = new Client();
    }

    /**
     * @return array
     */
    protected function getRequestHeaders()
    {
        return [];
    }

    /**
     * Sends POST request.
     * @param string $endpoint
     * @param $json
     * @param bool $async
     * @return mixed
     * @throws ServerException|ClientException
     */
    public function post($endpoint, $json, bool $async = false)
    {
        $requestMethod = ($async ? 'requestAsync' : 'request');

        $response = $this->http_client->{$requestMethod}('POST',
            "$this->baseUrl/$endpoint", [
                'json' => $json,
                'headers' => $this->getRequestHeaders(),
            ]);

        if ($async) {
            return $this->handleAsyncResponse($response);
        } else {
            return $this->handleResponse($response);
        }
    }

    /**
     * Sends PUT request.
     * @param string $endpoint
     * @param string $json
     * @param bool $async
     * @return mixed
     * @throws ServerException|ClientException
     */
    public function put($endpoint, $json, bool $async = false)
    {
        $requestMethod = ($async ? 'requestAsync' : 'request');

        $response = $this->http_client->{$requestMethod}('PUT',
            "$this->baseUrl/$endpoint", [
                'json' => $json,
                'headers' => $this->getRequestHeaders(),
            ]);

        if ($async) {
            return $this->handleAsyncResponse($response);
        } else {
            return $this->handleResponse($response);
        }
    }

    /**
     * Sends DELETE request.
     * @param string $endpoint
     * @param bool $async
     * @return mixed
     * @throws ServerException|ClientException
     */
    public function delete($endpoint, bool $async = false)
    {
        $requestMethod = ($async ? 'requestAsync' : 'request');

        $response = $this->http_client->{$requestMethod}('DELETE',
            "$this->baseUrl/$endpoint", [
                'headers' => $this->getRequestHeaders(),
            ]);

        if ($async) {
            return $this->handleAsyncResponse($response);
        } else {
            return $this->handleResponse($response);
        }
    }

    /**
     * @param string $endpoint
     * @param array $query
     * @param bool $async
     * @return mixed
     * @throws ServerException|ClientException
     */
    public function get($endpoint, $query = [], bool $async = false)
    {
        $requestMethod = ($async ? 'requestAsync' : 'request');
        $response = $this->http_client->{$requestMethod}('GET',
            "$this->baseUrl/$endpoint", [
                'query' => $query,
                'headers' => $this->getRequestHeaders(),

            ]);

        if ($async) {
            return $this->handleAsyncResponse($response);
        }

        return $this->handleResponse($response);
    }

    /**
     * @param Response $response
     * @return mixed
     */
    public function handleResponse(Response $response)
    {
        $stream = stream_for($response->getBody());
        $raw_response = json_decode($stream->getContents());

        return $raw_response;
    }

    /**
     * @param Promise $response
     * @return mixed
     */
    private function handleAsyncResponse(Promise $response) : Promise
    {
        return $response;
    }
}

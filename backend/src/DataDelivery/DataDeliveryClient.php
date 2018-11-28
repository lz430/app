<?php

namespace DeliverMyRide\DataDelivery;

use GuzzleHttp\Psr7\Response;
use DeliverMyRide\Common\ApiClient;
use function GuzzleHttp\Psr7\stream_for;

/**
 * https://xmlasvr.aisrebates.com/ais_xml/test.html.
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
        $this->baseUrl = 'https://xmlasvr.aisrebates.com/ais_xml/get_data.php';
    }

    protected function getRequestHeaders()
    {
        return [
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];
    }

    /**
     * @param $array
     * @param \SimpleXMLElement $element
     */
    public function mungeAttributesIntoArray(&$array, \SimpleXMLElement $element)
    {
        foreach ($element->attributes() as $k => $v) {
            $array[(string) $k] = (string) $v;
        }
    }

    public function mungeChildrenIntoArray(&$array, \SimpleXMLElement $element, $parent_keys = [])
    {
        foreach ($element->children() as $key => $childData) {
            if (isset($parent_keys[$key])) {
                $parent_key = $parent_keys[$key];
            } else {
                $parent_key = strtolower($key).'s';
            }

            if (! isset($array[$parent_key])) {
                $array[$parent_key] = [];
            }

            $child = [];
            $this->mungeAttributesIntoArray($child, $childData);
            $this->mungeChildrenIntoArray($child, $childData);
            $array[$parent_key][] = (object) $child;
        }
    }

    /**
     * Sends POST request.
     * @param string $endpoint
     * @param  $data
     * @param bool $async
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function post($endpoint, $data, bool $async = false)
    {
        $data['CustomerID'] = $this->id;
        $data['WebPass'] = $this->apiKey;

        $response = $this->http_client->request('POST',
            "$this->baseUrl/$endpoint", [
                'form_params' => $data,
                'headers' => $this->getRequestHeaders(),
            ]);

        return $this->handleResponse($response);
    }

    /**
     * @param Response $response
     * @return mixed
     */
    public function handleResponse(Response $response)
    {
        libxml_use_internal_errors(true);

        $stream = stream_for($response->getBody());
        $data = $stream->getContents();
        $raw_response = simplexml_load_string($data);

        if ($raw_response === false) {
            throw new FetchProgramDataException('Data Delivery API: Invalid XML returned'.$data);
        }

        return $raw_response;
    }

    public function get($endpoint, $query = [], bool $async = false)
    {
        throw new \BadMethodCallException();
    }

    public function put($endpoint, $json, bool $async = false)
    {
        throw new \BadMethodCallException();
    }

    public function delete($endpoint, bool $async = false)
    {
        throw new \BadMethodCallException();
    }
}

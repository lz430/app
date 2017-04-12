<?php

namespace DeliverMyRide\JATO;

use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private $guzzleClient;

    public function __construct()
    {
        $this->guzzleClient = new GuzzleClient();
        $this->authorize();
    }

    private function authorize()
    {
        $response = json_decode((string) $this->guzzleClient->request('POST', 'https://auth.jatoflex.com/oauth/token', [
            'form_params' => [
                'username' => env('JATO_USERNAME'),
                'password' => env('JATO_PASSWORD'),
                'grant_type' => 'password',
            ]
        ])->getBody(), true);

        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'https://api.jatoflex.com/api/en-us/',
            'headers' => [
                'Authorization' => $response['token_type'] . ' ' . $response['access_token'],
                'Subscription-Key' => 'e37102e58e4f42bf927743e6e92c41c3'
            ]
        ]);
    }

    public function makes()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'makes')->getBody(), true);
    }

    public function modelsByMakeName($makeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "makes/$makeName/models")->getBody(),
            true
        )['results'];
    }

    public function manufacturers()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'manufacturers')->getBody(), true)['results'];
    }

    public function makesByManufacturerUrlName($manufacturerName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "manufacturers/$manufacturerName/makes")->getBody(),
            true
        )['results'];
    }

    public function modelsVersionsByModelName($modelName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/versions")->getBody(),
            true
        )['results'];
    }

    public function modelsVersionsByModelNameAsync($modelName)
    {
        return $this->guzzleClient->requestAsync('GET', "models/$modelName/versions");
    }

    public function optionsByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "options/$vehicleId"
            )->getBody(),
            true
        );
    }
}

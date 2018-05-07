<?php

namespace DeliverMyRide\HubSpot;

use GuzzleHttp\Client as GuzzleClient;

class Client
{
    private $guzzleClient;

    public function __construct()
    {
        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'http://api.hubapi.com/',
            'connect_timeout' => 5,
        ]);
    }

    /**
     * @param $payload
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function createOrUpdateContact($payload)
    {

        $response = $this->guzzleClient->post(
            "/contacts/v1/contact/createOrUpdate/email/{$payload['email']}?hapikey=" . config('services.hubspot.api_key'),
            [
                'json' => ['properties' => $this->generateHubspotPayloadFrom($payload)],
            ]
        );

        return json_decode((string) $response->getBody(), true);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getContacts()
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                '/contacts/v1/lists/all/contacts/all?hapikey=' . config('services.hubspot.api_key')
            )->getBody(),
            true
        );
    }

    /**
     * @param $email
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function notifyUserWhenInRange($email)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'POST',
                'https://forms.hubspot.com/uploads/form/v2/3388780/1d44d5dc-d865-447e-9a56-3f11388c21f8',
                [
                    'form_params' => [
                        'email' => $email,
                    ],
                ]
            )->getBody(),
            true
        );
    }

    /**
     * @param $payload
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function submitBuyNowContactInfoForm($payload)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'POST',
                'https://forms.hubspot.com/uploads/form/v2/3388780/9cac9eed-3b2c-4d2f-9bc6-38b0c7b04c2f',
                [
                    'form_params' => [
                        'email' => $payload['email'],
                        'firstname' => $payload['firstname'],
                        'lastname' => $payload['lastname'],
                        'phone' => $payload['phone'],
                    ],
                ]
            )->getBody(),
            true
        );
    }
    
    /**
     * Transforms ['email' => 'hello@email.com'] to hubspot's preferred
     * ['property' => 'email', 'value' => 'hello@email.com']
     */
    private function generateHubspotPayloadFrom($payload)
    {
        return array_map(function ($key, $value) {
            return ['property' => $key, 'value' => $value];
        }, array_keys($payload), $payload);
    }
}

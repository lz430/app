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
    
    public function createContact($payload)
    {
        $hubspotPayload = $this->generateHubspotPayloadFrom($payload);
        
        return json_decode(
            (string) $this->guzzleClient->request(
                'POST',
                'contacts/v1/contact?hapikey=' . config('services.hubspot.api_key'),
                ['json' => ['properties' => $hubspotPayload]]
            )->getBody(),
            true
        );
    }
    
    public function updateContactByEmail($email, $payload)
    {
        $hubspotPayload = $this->generateHubspotPayloadFrom($payload);
    
        return json_decode(
            (string) $this->guzzleClient->request(
                'POST',
                "/contacts/v1/contact/createOrUpdate/email/{$email}?hapikey=" . config('services.hubspot.api_key'),
                ['json' => ['properties' => $hubspotPayload]]
            )->getBody(),
            true
        );
    }
    
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
    
    private function generateHubspotPayloadFrom($payload)
    {
        /**
         * Transforms ['email' => 'hello@email.com'] to hubspot's preferred
         * ['property' => 'email', 'value' => 'hello@email.com']
         */
        return array_map(function ($key, $value) {
            return ['property' => $key, 'value' => $value];
        }, array_keys($payload), $payload);
    }
}

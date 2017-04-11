<?php

namespace DeliverMyRide\JATO;

use \GuzzleHttp\Client as GuzzleClient;

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

    public function apptexts()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'apptexts')->getBody(), true);
    }

    public function apptext($apptext)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "apptexts/$apptext")->getBody(), true);
    }

    public function categories($vehicleID)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "categories/$vehicleID")->getBody(), true);
    }

    public function compareVehicle($vehicleId, $competitors)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "compare/$vehicleId", [
            'query' => ['competitors' => $competitors]
        ])->getBody(), true);
    }

    public function compareVehicleWithinCategory($vehicleId, $categoryId, $competitors)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "compare/$vehicleId/$categoryId", [
            'query' => ['competitors' => $competitors]
        ])->getBody(), true);
    }

    public function culture()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'culture')->getBody(), true);
    }

    public function vehicleEquipment($vehicleId)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "equipment/$vehicleId")->getBody(), true);
    }

    public function vehicleEquipmentSchema($vehicleId, $schemaId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "equipment/$vehicleId/schemaid/$schemaId")->getBody(),
            true
        );
    }

    public function vehicleEquipmentWithinCategory($vehicleId, $categoryId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "equipment/$vehicleId/$categoryId")->getBody(),
            true
        );
    }

    public function vehicleFeatures($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "features/$vehicleId")->getBody(),
            true
        );
    }

    public function vehicleFeaturesWithinCategory($vehicleId, $categoryId)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "features/$vehicleId/$categoryId")->getBody(),
            true
        );
    }

    public function filters()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'filters')->getBody(), true);
    }

    public function modelBodyOverviewByYear($modelBodyId, $modelYear)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "filters/$modelBodyId/$modelYear/modelBodyOverview"
            )->getBody(),
            true
        );
    }

    public function modelBodyVersionsByYear($modelBodyId, $modelYear)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "filters/$modelBodyId/$modelYear/versions"
            )->getBody(),
            true
        );
    }

    public function bodyStylesByUrlMakeName($urlMakeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "filters/$urlMakeName/bodystyles"
            )->getBody(),
            true
        );
    }

    public function modelsByUrlMakeName($urlMakeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "filters/$urlMakeName/models"
            )->getBody(),
            true
        );
    }

    public function competitorsImages($competitors)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                'images/JATO',
                [
                    'query' => [
                        'competitors' => $competitors
                    ]
                ]
            )->getBody(),
            true
        );
    }

    public function vehicleImagesSized($vehicleId, $size)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "images/JATO/$size/vehicle/$vehicleId"
            )->getBody(),
            true
        );
    }

    // what is the image server path?
    public function vehicleImages($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "images/JATO/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function makes()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'makes')->getBody(), true);
    }

    public function makesByMakeName($makeName)
    {
        return json_decode((string) $this->guzzleClient->request('GET', "makes/$makeName")->getBody(), true);
    }

    public function modelsByMakeName($makeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "makes/$makeName/models")->getBody(),
            true
        )['results'];
    }

    public function modelsYearStyleByMakeName($makeName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "makes/$makeName/modelsYearStyle")->getBody(),
            true
        );
    }

    public function manufacturers()
    {
        return json_decode((string) $this->guzzleClient->request('GET', 'manufacturers')->getBody(), true)['results'];
    }

    public function manufacturersByManufacturerName($manufacturerName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "manufacturers/$manufacturerName")->getBody(),
            true
        );
    }

    public function makesByManufacturerName($manufacturerName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "manufacturers/$manufacturerName/makes")->getBody(),
            true
        )['results'];
    }

    public function getModelByName($modelName)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName")->getBody(),
            true
        );
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

    public function modelsByModelNameAndBodyStyle($modelName, $bodyStyle)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$bodyStyle")->getBody(),
            true
        );
    }

    public function modelsVersionsByModelNameAndBodyStyle($modelName, $bodyStyle)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$bodyStyle/versions")->getBody(),
            true
        );
    }

    public function modelsByModelNameAndModelYear($modelName, $modelYear)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$modelYear")->getBody(),
            true
        );
    }

    public function modelVersionsByModelNameAndModelYear($modelName, $modelYear)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$modelYear/versions")->getBody(),
            true
        );
    }

    public function modelsByModelNameAndModelYearAndBodyStyle($modelName, $modelYear, $bodyStyle)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$modelYear/$bodyStyle")->getBody(),
            true
        );
    }

    public function modelVersionsByModelNameAndModelYearAndBodyStyle($modelName, $modelYear, $bodyStyle)
    {
        return json_decode(
            (string) $this->guzzleClient->request('GET', "models/$modelName/$modelYear/$bodyStyle/versions")->getBody(),
            true
        );
    }

    public function modelVersionsByModelNameAndModelYearAndBodyStyleAndCabType(
        $modelName,
        $modelYear,
        $bodyStyle,
        $cabType
    ) {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "models/$modelName/$modelYear/$bodyStyle/$cabType/versions"
            )->getBody(),
            true
        );
    }

    public function monthlyPaymentByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "monthlyPayment/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function monthlyPaymentByVehicleIdAndZipCode($vehicleId, $zipCode)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "monthlyPayment/$vehicleId/$zipCode"
            )->getBody(),
            true
        );
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

    public function similarCompetitorVehiclesByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "similar/$vehicleId/competitors"
            )->getBody(),
            true
        );
    }

    public function similarInModelVehicleVersionsByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "similar/$vehicleId/competitors"
            )->getBody(),
            true
        );
    }

    public function standardItemsByVehicleId($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "standard/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function standardItemDetailsByVehicleIdAndSchemaId($vehicleId, $schemaId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "standard/$vehicleId/schemaid/$schemaId"
            )->getBody(),
            true
        );
    }

    public function standardItemsByVehicleIdWithinCategory($vehicleId, $categoryId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "standard/$vehicleId/$categoryId"
            )->getBody(),
            true
        );
    }

    public function getVehicleById($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "vehicle/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function getVehicleVersionById($vehicleId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "versions/$vehicleId"
            )->getBody(),
            true
        );
    }

    public function getCityAndStateByZipCode($zipCode)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "zipcodes/$zipCode/"
            )->getBody(),
            true
        );
    }

    public function buildVehicleWithOptions($vehicleId, $optionId)
    {
        return json_decode(
            (string) $this->guzzleClient->request(
                'GET',
                "options/$vehicleId/build/$optionId",
                ['query' => ['previousOptionIds' => '1']]
            )->getBody(),
            true
        );
    }

}

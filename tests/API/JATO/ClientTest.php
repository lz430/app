<?php

namespace Tests\Feature;

use DeliverMyRide\JATO\Client;
use Dotenv\Dotenv;
use Tests\TestCase;

class ClientTest extends TestCase
{
    /** @var $client Client */
    private static $client;

    public static function setUpBeforeClass()
    {
        (new Dotenv(__DIR__ . '/../../../'))->load();

        static::$client = new Client();
    }

    /** @test */
    public function can_get_apptexts()
    {
        $this->assertArrayHasKey('vin_label', static::$client->apptexts());
    }

    public function can_compare_vehicle_to_competitors()
    {
        static::$client->compare();
    }

    public function can_get_vehicle_categories()
    {
        static::$client->categories();
    }

    /** @test */
    public function can_get_culture()
    {
        $this->assertArrayHasKey('code', static::$client->culture());
    }

    public function can_get_vehicle_equipment()
    {
        static::$client->vehicleEquipment();
    }

    public function can_get_vehicle_equipment_schema()
    {
        static::$client->vehicleEquipmentSchema();
    }

    public function can_get_vehicle_equipment_within_category()
    {
        static::$client->vehicleEquipmentWithinCategory();
    }

    /** @test */
    public function can_get_vehicle_features()
    {
        static::$client->vehicleFeatures('15425119960103');
    }

    public function can_get_vehicle_features_within_category()
    {
        static::$client->vehicleEquipmentWithinCategory();
    }

    /** @test */
    public function can_get_filters()
    {
        static::$client->filters();
    }

    public function can_get_model_body_overview_by_year()
    {
        static::$client->modelBodyOverviewByYear();
    }

    public function can_get_model_body_versions_by_year()
    {
        static::$client->modelBodyVersionsByYear();
    }

    public function can_get_body_styles_by_url_make_name()
    {
        static::$client->bodyStylesByUrlMakeName();
    }

    public function can_get_models_by_url_make_name()
    {
        static::$client->modelsByUrlMakeName();
    }

    public function can_get_competitors_images()
    {
        static::$client->competitorsImages();
    }

    public function can_get_vehicle_images_sized()
    {
        static::$client->vehicleImagesSized();
    }

    /** @test */
    public function can_get_vehicle_images()
    {
        static::$client->vehicleImages('15425119960103');
    }

    /** @test */
    public function can_get_makes()
    {
        $this->assertArrayHasKey('results', static::$client->makes());
    }

    public function can_get_makes_by_make_name()
    {
        static::$client->makesByMakeName();
    }

    /** @test */
    public function can_get_models_by_make_name()
    {
        static::$client->modelsByMakeName('Nissan');
    }

    public function can_get_models_year_style_by_make_name()
    {
        static::$client->modelsYearStyleByMakeName();
    }

    /** @test */
    public function can_get_manufacturers()
    {
        static::$client->manufacturers();
    }

    /** @test */
    public function can_get_manufacturers_by_manufacturer_name()
    {
        static::$client->manufacturersByManufacturerName('nissan');
    }

    /** @test */
    public function can_get_makes_by_manufacturer_name()
    {
        static::$client->makesByManufacturerName('nissan');
    }

    public function can_get_model_by_name()
    {
        static::$client->getModelByName();
    }

    /** @test */
    public function can_get_model_versions_by_model_name()
    {
        static::$client->modelsVersionsByModelName('xterra');
    }

    public function can_get_model_by_model_name_and_body_style()
    {
        static::$client->modelsByModelNameAndBodyStyle();
    }

    public function can_get_model_versions_by_model_name_and_body_style()
    {
        static::$client->modelsVersionsByModelNameAndBodyStyle();
    }

    public function can_get_models_by_model_name_and_model_year()
    {
        static::$client->modelsByModelNameAndModelYear();
    }

    public function can_get_models_versions_by_model_name_and_model_year()
    {
        static::$client->modelVersionsByModelNameAndModelYear();
    }

    public function can_get_models_by_model_name_and_model_year_and_body_style()
    {
        static::$client->modelsByModelNameAndModelYearAndBodyStyle();
    }

    public function can_get_model_versions_by_model_name_and_model_year_and_body_style()
    {
        static::$client->modelVersionsByModelNameAndModelYearAndBodyStyle();
    }

    public function can_get_model_versions_by_model_name_and_model_year_and_body_style_and_cab_type()
    {
        static::$client->modelVersionsByModelNameAndModelYearAndBodyStyleAndCabType();
    }

    public function can_get_monthly_payment_by_vehicle_id()
    {
        static::$client->monthlyPaymentByVehicleId();
    }

    public function can_get_monthly_payment_by_vehicle_id_and_zip_code()
    {
        static::$client->monthlyPaymentByVehicleIdAndZipCode();
    }

    /** @test */
    public function can_get_options_by_vehicle_id()
    {
        static::$client->optionsByVehicleId('61539620000131');
    }

    public function can_get_similar_competitor_vehicles()
    {
        static::$client->similarCompetitorVehiclesByVehicleId();
    }

    public function can_get_similar_in_model_vehicle_versions_by_vehicle_id()
    {
        static::$client->similarInModelVehicleVersionsByVehicleId();
    }

    public function can_get_standard_items_by_vehicle_id()
    {
        static::$client->standardItemsByVehicleId();
    }

    public function can_get_standard_item_details_by_vehicle_id_and_schema_id()
    {
        static::$client->standardItemDetailsByVehicleIdAndSchemaId();
    }

    public function can_get_standard_items_by_vehicle_id_within_category()
    {
        static::$client->standardItemsByVehicleIdWithinCategory();
    }

    /** @test */
    public function can_get_vehicle_by_id()
    {
        static::$client->getVehicleById('61539620000131');
    }

    /** @test */
    public function can_get_vehicle_versions_by_id()
    {
        static::$client->getVehicleVersionsById('61539620000131');
    }

    /** @test */
    public function can_get_city_and_state_by_zip_code()
    {
        static::$client->getCityAndStateByZipCode('75703');
    }
}

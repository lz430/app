<?php

namespace App\Console\Commands;

use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Promise\EachPromise;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Psr\Http\Message\ResponseInterface;

class LoadVehiclesFromJATO extends Command
{
    protected $signature = 'jato:load';
    protected $description = 'Load vehicles from JATO.';
    private $client;

    public function __construct(JatoClient $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    public function handle()
    {
        $versionsPromises = [];

        foreach ($this->client->manufacturers() as $manufacturerResponse) {
            $manufacturer = $this->saveManufacturer($manufacturerResponse);

            foreach ($this->client->makesByManufacturerUrlName($manufacturer->url_name) as $makeResponse) {
                $vehicleMake = $this->saveManufacturerMake($manufacturer, $makeResponse);

                foreach ($this->client->modelsByMakeName($vehicleMake->url_name) as $modelResponse) {
                    $vehicleModel = $this->saveMakeModel($vehicleMake, $modelResponse);

                    $versionsPromises[] = $this->client->modelsVersionsByModelNameAsync($vehicleModel->url_name)
                        ->then(function (ResponseInterface $response) use ($vehicleModel) {
                            foreach (json_decode((string) $response->getBody(), true)['results'] as $version) {
                                $this->saveModelVersionAndOptionsAndTaxesAndDiscounts($vehicleModel, $version);
                            }
                        });
                }
            }
        }

        $this->resolvePromises($versionsPromises);
    }

    private function saveManufacturer(array $manufacturer)
    {
        $this->info('Saving Manufacturer: ' . $manufacturer['manufacturerName']);

        return Manufacturer::updateOrCreate([
            'url_name' => $manufacturer['urlManufacturerName']
        ], [
            'name' => $manufacturer['manufacturerName'],
            'url_name' => $manufacturer['urlManufacturerName'],
            'is_current' => $manufacturer['isCurrent'],
        ]);
    }

    private function saveManufacturerMake(Manufacturer $manufacturer, array $make)
    {
        $this->info('Saving Manufacturer Make: ' . $make['makeName']);

        return $manufacturer->makes()->updateOrCreate([
            'url_name' => $make['urlMakeName'],
        ], [
            'name' => $make['makeName'],
            'url_name' => $make['urlMakeName'],
            'is_current' => $make['isCurrent'],
        ]);
    }

    private function saveMakeModel(Make $make, array $model)
    {
        $this->info('Saving Make Model: ' . $model['modelName']);

        return $make->models()->updateOrCreate([
            'url_name' => $model['urlModelName']
        ], [
            'name' => $model['modelName'],
            'url_name' => $model['urlModelName'],
            'is_current' => $model['isCurrent'],
        ]);
    }

    private function saveModelVersion(VehicleModel $vehicleModel, array $version)
    {
        $this->info('Saving Model Version: ' . $version['vehicleId']);

        return $vehicleModel->versions()->updateOrCreate([
            'jato_uid' => $version['uid'],
            'year' => $version['modelYear'],
        ], [
            'jato_vehicle_id' => $version['vehicleId'],
            'jato_uid' => $version['uid'],
            'jato_model_id' => $version['modelId'],
            'year' => $version['modelYear'],
            'name' => !in_array($version['versionName'], ['-', ''])
                ? $version['versionName']
                : null,
            'trim_name' => $version['trimName'],
            'description' => rtrim($version['headerDescription'], ' -'),
            'driven_wheels' => $version['drivenWheels'],
            'doors' => $version['numberOfDoors'],
            'transmission_type' => $version['transmissionType'],
            'msrp' => $version['msrp'] !== '' ? $version['msrp'] : null,
            'invoice' => $version['invoice'] !== '' ? $version['invoice'] : null,
            'body_style' => $version['bodyStyleName'],
            'photo_path' => $version['photoPath'],
            'fuel_econ_city' => $version['fuelEconCity'] !== ''
                ? $version['fuelEconCity']
                : null,
            'fuel_econ_hwy' => $version['fuelEconHwy'] !== ''
                ? $version['fuelEconHwy']
                : null,
            'manufacturer_code' => !in_array($version['manufacturerCode'], ['-', ''])
                ? $version['manufacturerCode']
                : null,
            'delivery_price' => $version['delivery'] !== ''
                ? $version['delivery']
                : null,
            'is_current' => $version['isCurrent'],
        ]);
    }

    private function saveVersionTaxesAndDiscounts(Version $version, array $taxesAndDiscounts)
    {
        $this->info("Saving Version Taxes and Discounts: $version->name");

        foreach ($taxesAndDiscounts as $taxOrDiscount) {
            $version->taxesAndDiscounts()->updateOrCreate([
                'name' => $taxOrDiscount['item1'],
                'version_id' => $version->id,
            ], [
                'name' => $taxOrDiscount['item1'],
                'version_id' => $version->id,
                'amount' => $taxOrDiscount['item2'],
            ]);
        }
    }

    private function saveVersionOptions(Version $version, $options)
    {
        $this->info("Saving Version Options: $version->name");

        foreach ($options as $option) {
            if (empty($option['optionName']) && empty($option['optionDescription'])) {
                continue;
            }

            $version->options()->updateOrCreate([
                'jato_option_id' => $option['optionId'],
                'version_id' => $version->id,
            ], [
                'name' => $option['optionName'],
                'state' => $option['optionState'],
                'description' => $option['optionDescription'],
                'option_code' => $option['optionCode'],
                'option_type' => $option['optionType'],
                'msrp' => $option['msrp'],
                'invoice' => $option['invoicePrice'],
                'version_id' => $version->id,
            ]);
        }
    }

    private function resolvePromises($promises)
    {
        (new EachPromise($promises, [
            'concurrency' => 5,
            'fulfilled' => function ($ModelAndVersionsResponse) {
                $this->info('Versions data loading complete.');
            }
        ]))->promise()->wait();
    }

    private function saveModelVersionAndOptionsAndTaxesAndDiscounts(VehicleModel $vehicleModel, array $version)
    {
        try {
            $vehicleVersion = $this->saveModelVersion($vehicleModel, $version);

            $options = $this->client->optionsByVehicleId($vehicleVersion->jato_vehicle_id);

            $this->saveVersionTaxesAndDiscounts($vehicleVersion, $options['taxes']);
            $this->saveVersionOptions($vehicleVersion, $options['options']);
        } catch (QueryException $e) {
            $this->info('Duplicate Version (Ignoring).');
            $this->info($e->getMessage());
        } catch (ServerException $e) {
            $this->error(
                'Error retrieving options for vehicleID: ' . $version['vehicleId']
            );
        }
    }
}

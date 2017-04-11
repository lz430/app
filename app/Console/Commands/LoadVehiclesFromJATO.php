<?php

namespace App\Console\Commands;

use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use DeliverMyRide\JATO\Client;
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

    public function __construct(Client $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $versionsPromises = [];
        $manufacturers = $this->client->manufacturers();

        foreach ($manufacturers as $manufacturer) {
            // save manufacturers
            /** @var Manufacturer $manufacturer */
            $manufacturer = Manufacturer::updateOrCreate([
                'url_name' => $manufacturer['urlManufacturerName']
            ], [
                'name' => $manufacturer['manufacturerName'],
                'url_name' => $manufacturer['urlManufacturerName'],
                'is_current' => $manufacturer['isCurrent'],
            ]);

            $this->info('Updated Manufacturer: ' . $manufacturer->name);

            $makes = $this->client->makesByManufacturerName($manufacturer->url_name);

            foreach ($makes as $make) {
                // save makes
                /** @var Make $vehicleMake */
                $vehicleMake = $manufacturer->makes()->updateOrCreate([
                    'url_name' => $make['urlMakeName'],
                ], [
                    'name' => $make['makeName'],
                    'url_name' => $make['urlMakeName'],
                    'is_current' => $make['isCurrent'],
                ]);

                $this->info('Updated Make: ' . $vehicleMake->name);

                $models = $this->client->modelsByMakeName($vehicleMake->url_name);

                foreach ($models as $model) {
                    /** @var VehicleModel $vehicleModel */
                    $vehicleModel = $vehicleMake->models()->updateOrCreate([
                        'url_name' => $model['urlModelName']
                    ], [
                        'name' => $model['modelName'],
                        'url_name' => $model['urlModelName'],
                        'is_current' => $model['isCurrent'],
                    ]);

                    $this->info('Updated Model: ' . $vehicleModel->name);

                    $versionsPromises[] = $this->client->modelsVersionsByModelNameAsync($vehicleModel->url_name)
                        ->then(function (ResponseInterface $response) use ($vehicleModel) {
                            $versions = json_decode((string)$response->getBody(), true)['results'];

                            foreach ($versions as $version) {
                                try {
                                    /** @var Version $vehicleVersion */
                                    $vehicleVersion = $vehicleModel->versions()->updateOrCreate([
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

                                    $this->info('Updated Version: ' . $vehicleVersion->name);

                                    // get options
                                    $options = $this->client->optionsByVehicleId($vehicleVersion->jato_vehicle_id);

                                    // save taxes and discounts to version
                                    foreach ($options['taxes'] as $tax) {
                                        $vehicleVersion->taxesAndDiscounts()->updateOrCreate([
                                            'name' => $tax['item1'],
                                            'version_id' => $vehicleVersion->id,
                                        ], [
                                            'name' => $tax['item1'],
                                            'version_id' => $vehicleVersion->id,
                                            'amount' => $tax['item2'],
                                        ]);

                                        $this->info('Updated Taxes and Discounts: ' . $vehicleVersion->name);
                                    }

                                    // save options
                                    foreach ($options['options'] as $option) {
                                        if (empty($option['optionName']) && empty($option['optionDescription'])) {
                                            continue;
                                        }

                                        $vehicleVersion->options()->updateOrCreate([
                                            'jato_option_id' => $option['optionId'],
                                            'version_id' => $vehicleVersion->id,
                                        ], [
                                            'name' => $option['optionName'],
                                            'state' => $option['optionState'],
                                            'description' => $option['optionDescription'],
                                            'option_code' => $option['optionCode'],
                                            'option_type' => $option['optionType'],
                                            'msrp' => $option['msrp'],
                                            'invoice' => $option['invoicePrice'],
                                            'version_id' => $vehicleVersion->id,
                                        ]);

                                        $this->info('Updated Options: ' . $vehicleVersion->name);
                                    }
                                } catch (QueryException $e) {
                                    $this->error('clash uid and modelId');
                                    $this->error($e->getMessage());
                                } catch (ServerException $e) {
                                    $this->error(
                                        'Error retrieving options for vehicleID: ' . $version['vehicleId']
                                    );
                                }
                            }
                        });
                }
            }
        }

        // resolve all versions promises
        (new EachPromise($versionsPromises, [
            'concurrency' => 5,
            'fulfilled' => function ($ModelAndVersionsResponse) {
                $this->info('fulfilled');
            }
        ]))->promise()->wait();
    }
}

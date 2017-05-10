<?php

namespace DeliverMyRide\Vauto;

use App\JATO\Version;
use App\VersionDeal;
use Carbon\Carbon;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;

class Importer
{
    private const HEADERS = [
        "DealerId",
        "Stock #",
        "VIN",
        "New/Used",
        "Year",
        "Make",
        "Model",
        "Model Code",
        "Body",
        "Transmission",
        "Series",
        "Series Detail",
        "Door Count",
        "Odometer",
        "Engine Cylinder Ct",
        "Engine Displacement",
        "Drivetrain Desc",
        "Colour",
        "Interior Color",
        "Price",
        "MSRP",
        "Inventory Date",
        "Certified",
        "Description",
        "Features",
        "City MPG",
        "Highway MPG",
        "Photo Count",
        "Photos",
        "Photos Last Modified Date",
        "Dealer Name",
        "Engine",
        "Fuel",
        "Age",
    ];

    private $filesystem;
    private $client;
    private $info;

    public function __construct(Filesystem $filesystem, JatoClient $client)
    {
        $this->filesystem = $filesystem;
        $this->client = $client;
    }

    public function setInfoFunction(callable $infoFunction)
    {
        $this->info = $infoFunction;
    }

    private function info(string $info)
    {
        if ($this->info) {
            call_user_func($this->info, $info);
        }
    }

    public function import()
    {
        foreach ($this->filesystem->files(base_path(config('services.vauto.uploads_path'))) as $file) {
            $handle = fopen($file, 'r');

            $this->checkHeaders(fgetcsv($handle));

            $this->saveVersionDeals($handle, md5_file($file));
        };
    }

    private function saveVersionDeals($handle, string $fileHash)
    {
        while (($data = fgetcsv($handle)) !== false) {
            $keyedData = $this->keyedArray($data);

            try {
                $decoded = $this->client->decodeVin($keyedData['VIN']);

                DB::transaction(function () use ($decoded, $keyedData, $fileHash) {
                    foreach (Version::whereIn(
                        'jato_uid',
                        collect($decoded['versions'])->pluck('uid')
                    )->get() as $version) {
                        /** @var VersionDeal $versionDeal */
                        $versionDeal = $this->saveVersionDeal($version, $fileHash, $keyedData);

                        $this->saveVersionDealPhotos(
                            $versionDeal,
                            $keyedData['Photos']
                        );

                        $this->saveVersionDealOptions(
                            $versionDeal,
                            $keyedData['Features']
                        );
                    }
                });
            } catch (ClientException $e) {
                $this->info("Unable to decode vin: {$keyedData['VIN']}");
            }
        }
    }

    private function saveVersionDealOptions(VersionDeal $versionDeal, string $options)
    {
        foreach (collect(explode('|', $options))->filter(function ($option) {
            return $option !== '';
        }) as $option) {
            $versionDeal->options()->updateOrCreate([
                'option' => $option
            ], [
                'option' => $option
            ]);
        }
    }

    private function saveVersionDealPhotos(VersionDeal $versionDeal, string $photos)
    {
        foreach (collect(explode('|', $photos))->map(function ($url) {
            return str_replace('http://', 'https://', $url);
        }) as $url) {
            $versionDeal->photos()->updateOrCreate([
                'url' => $url
            ], [
                'url' => $url
            ]);
        }
    }

    private function saveVersionDeal(Version $version, string $fileHash, array $keyedData)
    {
        $this->info("Saving deal for vin: {$keyedData['VIN']}");

        return $version->deals()->updateOrCreate([
            'file_hash' => $fileHash,
            'dealer_id' => $keyedData['DealerId'],
            'stock_number' => $keyedData['Stock #'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $keyedData['DealerId'],
            'stock_number' => $keyedData['Stock #'],
            'vin' => $keyedData['VIN'],
            'new' => $keyedData['New/Used'] === 'Y',
            'year' => $keyedData['Year'],
            'make' => $keyedData['Make'],
            'model' => $keyedData['Model'],
            'model_code' => $keyedData['Model Code'],
            'body' => $keyedData['Body'],
            'transmission' => $keyedData['Transmission'],
            'series' => $keyedData['Series'],
            'series_detail' => $keyedData['Series Detail'],
            'door_count' => $keyedData['Door Count'],
            'odometer' => $keyedData['Odometer'],
            'engine' => $keyedData['Engine'],
            'fuel' => $keyedData['Fuel'],
            'color' => $keyedData['Colour'],
            'interior_color' => $keyedData['Interior Color'],
            'price' => $keyedData['Price'] !== '' ? $keyedData['Price'] : null,
            'msrp' => $keyedData['MSRP'] !== '' ? $keyedData['MSRP'] : null,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $keyedData['Inventory Date']),
            'certified' => $keyedData['Certified'] === 'Yes',
            'description' => $keyedData['Description'],
            'fuel_econ_city' => $keyedData['City MPG'] !== '' ? $keyedData['City MPG'] : null,
            'fuel_econ_hwy' => $keyedData['Highway MPG'] !== '' ? $keyedData['Highway MPG'] : null,
            'dealer_name' => $keyedData['Dealer Name'],
            'days_old' => $keyedData['Age'],
        ]);
    }

    private function keyedArray(array $data)
    {
        return array_combine(self::HEADERS, $data);
    }

    private function checkHeaders(array $headers)
    {
        if (self::HEADERS !== $headers) {
            throw new MismatchedHeadersException(
                implode(', ', $headers) . 'does not match expeced headers: ' . implode(', ', self::HEADERS)
            );
        }
    }
}

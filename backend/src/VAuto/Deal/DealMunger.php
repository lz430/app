<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use App\Models\JATO\Version;
use Carbon\Carbon;

class DealMunger
{
    /* @var DealPhotosMunger */
    private $photoManager;

    /* @var DealFiltersMunger */
    private $equipmentManager;

    /* @var DealOptionsMunger */
    private $optionsManager;

    public function __construct()
    {
        $this->photoManager = new DealPhotosMunger();
        $this->equipmentManager = new DealFiltersMunger();
        $this->optionsManager = new DealOptionsMunger();
    }

    /**
     * @param array $row
     * @return \stdClass
     */
    private function getDealSourcePrice($row)
    {
        /**
         * key: internal value
         * value: vauto row header.
         */
        $map = [
            'msrp' => 'MSRP',
            'price' => 'Price',
            'invoice' => 'Invoice',
            'sticker' => 'Sticker',
            'dealerdiscounted' => 'Dealer Discounted',
            'memoline1' => 'MEMOLINE1',
            'memoline2' => 'MEMOLINE2',
            'floorplanamount' => 'FLOORPLANAMOUNT',
            'salescost' => 'SALESCOST',
            'invoiceamount' => 'INVOICEAMOUNT',
        ];

        $return = [];

        foreach ($map as $key => $value) {
            if ($row[$value]) {
                $return[$key] = trim($row[$value]);
            }
        }

        return (object) $return;
    }


    /**
     * @param Version $version
     * @param string $fileHash
     * @param array $row
     * @return Deal
     */
    public function saveOrUpdateDeal(Version $version, string $fileHash, array $row): Deal
    {
        $pricing = $this->getDealSourcePrice($row);
        if (! isset($pricing->msrp) && $version->msrp) {
            $pricing->msrp = $version->msrp;
        }

        // Remove utf8 chars.
        if ($row['Features']) {
            $vauto_features = preg_replace('/[^\x01-\x7F]/', '', $row['Features']);
        } else {
            $vauto_features = null;
        }

        /* @var Deal $deal */
        $deal = Deal::updateOrCreate([
            'vin' => $row['VIN'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $row['DealerId'],
            'stock_number' => $row['Stock #'],
            'vin' => $row['VIN'],
            'new' => $row['New/Used'] === 'N',
            'year' => $row['Year'],
            'make' => $row['Make'],
            'model' => $row['Model'],
            'model_code' => $row['Model Code'],
            'body' => $row['Body'],
            'transmission' => $row['Transmission'],
            'series' => $row['Series'],
            'series_detail' => $row['Series Detail'],
            'door_count' => $row['Door Count'],
            'odometer' => $row['Odometer'],
            'engine' => $row['Engine'],
            'fuel' => $row['Fuel'],
            'color' => $row['Colour'],
            'interior_color' => $row['Interior Color'],
            'price' => isset($pricing->price) ? $pricing->price : null,
            'msrp' => (isset($pricing->msrp) && (strlen($pricing->msrp) <= 6)) ? $pricing->msrp : ((strlen($pricing->msrp) > 6) ? substr($pricing->msrp, 0, 6) : null),
            'vauto_features' => $vauto_features,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $row['Inventory Date']),
            'certified' => $row['Certified'] === 'Yes',
            'description' => $row['Description'],
            'option_codes' => array_filter(explode(',', $row['Option Codes'])),
            'fuel_econ_city' => (is_numeric($row['City MPG'])) ? $row['City MPG'] : 0,
            'fuel_econ_hwy' => (is_numeric($row['Highway MPG'])) ? $row['Highway MPG'] : 0,
            'dealer_name' => $row['Dealer Name'],
            'days_old' => (is_numeric($row['Age'])) ? $row['Age'] : 0,
            'version_id' => $version->id,
            'source_price' => $pricing,
            // TODO: we should mark things as available if they are in the feed, but only if they weren't sold via DMR somehow.
            'status' => 'available',
            'sold_at' => null,
        ]);

        return $deal;
    }

    /**
     * @param Deal $deal
     * @param array $data
     * @param bool $force
     * @return array
     */
    public function decorate(Deal $deal, array $data, bool $force = false)
    {
        $debug = [];

        // OPTIONS MUST BE RAN BEFORE EQUIPMENT!
        $options_debug = $this->optionsManager->import($deal, $force);
        $equipment_debug = $this->equipmentManager->import($deal, $force);
        $photos_debug = $this->photoManager->import($deal, $data, $force);

        return array_merge($debug, $options_debug, $equipment_debug, $photos_debug);
    }
}

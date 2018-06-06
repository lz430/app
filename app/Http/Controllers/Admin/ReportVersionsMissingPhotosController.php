<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\VersionToFuel;

use App\Models\JATO\Version;

class ReportVersionsMissingPhotosController extends Controller
{
    public function index(FuelClient $client)
    {
        $versions = Version::doesntHave('photos')->has('deals')->orderBy('year', 'desc')->get();

        $versions->map(function ($item) use ($client) {
            $manager = new VersionToFuel($item, $client);
            $vehicle = $manager->matchFuelVehicleToVersion();
            if ($vehicle) {
                $item->lookup_by = $vehicle;
            } else {
                $item->lookup_by = $manager->getSearchParams();
            }

            return $item;
        });

        return view('admin.reports.versions-missing-photos', ['versions' => $versions]);
    }

}

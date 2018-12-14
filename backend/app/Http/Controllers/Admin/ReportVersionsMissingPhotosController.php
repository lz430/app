<?php

namespace App\Http\Controllers\Admin;

use App\Models\JATO\Version;
use DeliverMyRide\Fuel\FuelClient;
use App\Http\Controllers\Controller;
use DeliverMyRide\Fuel\Manager\VersionToFuel;

class ReportVersionsMissingPhotosController extends Controller
{
    public function index(FuelClient $client)
    {
        $versions = Version::doesntHave('photos')->has('deals')->orderBy('year', 'desc')->get();

        $versions->map(function ($item) use ($client) {
            $manager = new VersionToFuel($client);
            $vehicle = $manager->matchFuelVehicleToVersion($item);
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

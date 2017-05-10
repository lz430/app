<?php

namespace DeliverMyRide;

use App\JATO\Version;
use App\SavedVehicle;
use App\VersionDeal;
use InvalidArgumentException;

class DealComparer
{
    private const PARAMETERS = [
        'trim',
        'year',
    ];
    private $weights;

    public function __construct(array $weights = [])
    {
        if (empty($weights)) {
            $this->weights = array_fill_keys(self::PARAMETERS, 100 / count(self::PARAMETERS));
        } else {
            $this->ensureValidWeights($weights);

            $this->weights = $weights;
        }
    }

    public function getPercentMatch(HasOptions $versionOrSavedVehicle, VersionDeal $versionDeal)
    {
        $version = $this->versionFromVersionOrSavedVehicle($versionOrSavedVehicle);

        return array_sum([
            $this->year($version, $versionDeal),
            $this->trim($version, $versionDeal),
        ]);
    }

    private function versionFromVersionOrSavedVehicle($versionOrSavedVehicle) : Version
    {
        if ($versionOrSavedVehicle instanceof Version) {
            return $versionOrSavedVehicle;
        }

        if ($versionOrSavedVehicle instanceof SavedVehicle) {
            return $versionOrSavedVehicle->version;
        }

        throw new InvalidArgumentException;
    }

    private function ensureValidWeights(array $weights)
    {
        /** Is a subset of parameter options and adds up to 100 */
        if (!empty(array_diff(array_keys($weights), self::PARAMETERS)) || array_sum(array_values($weights)) !== 100) {
            throw new InvalidArgumentException;
        }
    }

    private function trim(Version $version, VersionDeal $versionDeal)
    {
        return $version->trim_name === $versionDeal->series
            ? $this->weights['trim']
            : 0;
    }

    private function year(Version $version, VersionDeal $versionDeal)
    {
        $differenceInYears = abs($version->year - $versionDeal->year);

        return max(0, $this->weights['year'] - $differenceInYears);
    }
}

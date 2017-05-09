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
        if (!$this->checkValidWeights($weights)) {
            throw new InvalidArgumentException;
        }

        $this->weights = !empty($weights)
            ? $weights
            /** Default equal weights */
            : array_fill_keys(self::PARAMETERS, 100 / count(self::PARAMETERS));
    }

    public function getPercentMatch(HasOptions $versionOrSavedVehicle, VersionDeal $versionDeal)
    {
        return array_sum([
            $this->year($versionOrSavedVehicle, $versionDeal),
            $this->trim($versionOrSavedVehicle, $versionDeal)
        ]);
    }

    private function checkValidWeights(array $weights)
    {
        /** Add up to 100 and is a subset of parameter options */
        return !array_diff(array_keys($weights), self::PARAMETERS) && array_sum(array_values($weights)) === 100;
    }

    private function trim(HasOptions $versionOrSavedVehicle, VersionDeal $versionDeal)
    {
        return $this->prop($versionOrSavedVehicle, 'trim_name') === $versionDeal->series
            ? $this->weights['trim']
            : 0;
    }

    private function year(HasOptions $versionOrSavedVehicle, VersionDeal $versionDeal)
    {
        $differenceInYears = abs($this->prop($versionOrSavedVehicle, 'year') - $versionDeal->year);

        return max(0, $this->weights['year'] - $differenceInYears);
    }

    /**
     * Access property on a Version or SavedVehicle transparently
     *
     * @param HasOptions $versionOrSavedVehicle
     * @param string $property
     * @return mixed
     */
    private function prop(HasOptions $versionOrSavedVehicle, string $property)
    {
        if ($versionOrSavedVehicle instanceof Version) {
            return $versionOrSavedVehicle->{$property};
        }

        if ($versionOrSavedVehicle instanceof SavedVehicle) {
            return $versionOrSavedVehicle->version->{$property};
        }

        return null;
    }
}

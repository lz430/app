<?php

namespace DeliverMyRide;

use App\JATO\Version;
use App\VersionDeal;

class VersionAndDealComparer
{
    private const PARAMETERS = [
        'trim',
        'year',
    ];
    private $weights;

    public function __construct(array $weights = [])
    {
        $this->weights = $this->checkValidWeights($weights)
            ? $weights
            /** Default equal weights */
            : array_fill_keys(self::PARAMETERS, 100 / count(self::PARAMETERS));
    }

    public function getPercentMatch(Version $version, VersionDeal $versionDeal)
    {
        return array_sum([
            $this->year($version, $versionDeal),
            $this->trim($version, $versionDeal)
        ]);
    }

    private function checkValidWeights(array $weights)
    {
        /** Add up to 100 and is a subset of parameter options */
        return (array_sum(array_values($weights)) === 100 && !array_diff(array_keys($weights), self::PARAMETERS));
    }

    private function trim(Version $version, VersionDeal $versionDeal)
    {
        return $version->trim_name === $versionDeal->series ? $this->weights[__FUNCTION__] : 0;
    }

    private function year(Version $version, VersionDeal $versionDeal)
    {
        $differenceInYears = abs($version->year - $versionDeal->year);

        return max(0, $this->weights[__FUNCTION__] - $differenceInYears);
    }
}

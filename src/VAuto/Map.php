<?php


namespace DeliverMyRide\VAuto;

class Map {

    public const VAUTO_TRANSMISSION_TO_JATO_PACKAGE = [
        '6-Speed Automatic with Powershift' => '6-Speed PowerShift Automatic',
    ];

    public const SIZE_TO_JATO_SIZES = [
        'subcompact' => ['budget'],
        'compact' => ['compact pickup', 'lower mid', 'small'],
        'full-size' => ['full size', 'upper mid', 'luxury'],
        'mid-size' => ['compact suv', 'mid'],
        'minivan' => ['mini van'],
        'sports' => ['sports'],
    ];

    public const IMPORT_MAKE_BLACKLIST = [
        'smart',
    ];
}
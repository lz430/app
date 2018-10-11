<?php


namespace DeliverMyRide\VAuto;

class Map {

    public const VAUTO_TRANSMISSION_TO_JATO_PACKAGE = [
        '6-Speed Automatic with Powershift' => '6-Speed PowerShift Automatic',
    ];

    public const SIZE_TO_JATO_SIZES = [
        'subcompact' => ['budget'],
        'compact' => ['lower mid', 'small', 'sporty'],
        'full-size' => ['full size'], // removed luxury
        'mid-size' => ['compact suv', 'mid', 'compact pickup', 'upper mid'],
        'minivan' => ['mini van'],
        'sports' => ['sports'],
    ];

    public const LUXURY_SIZE_QUALIFIER = [
        'coupe' => ['two-seat'],
        'full-size' => ['large', 'unknown'],
        'compact' => ['compact cars'],
        'mid-size' => ['unknown', 'small wagons', 'mid-size wagons'],
    ];

    public const IMPORT_MAKE_BLACKLIST = [
        'smart',
    ];
}
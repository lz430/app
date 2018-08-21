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

    public const CATEGORY_MAP = [
        'vehicle_size' => [
            'id' => 1,
            'title' => 'Vehicle Size',
        ],
        'fuel_type' => [
            'id' => 2,
            'title' => 'Fuel Type',
        ],
        'transmission' => [
            'id' => 3,
            'title' => 'Transmission',
        ],
        'drive_train' => [
            'id' => 4,
            'title' => 'Drive Train',
        ],
        'comfort_and_convenience' => [
            'id' => 5,
            'title' => 'Comfort & Convenience',
        ],
        'seating' => [
            'id' => 6,
            'title' => 'Seating',
        ],
        'seat_materials' => [
            'id' => 7,
            'title' => 'Seat Materials',
        ],
        'seating_configuration' => [
            'id' => 8,
            'title' => 'Seating Configuration',
        ],
        'infotainment' => [
            'id' => 9,
            'title' => 'Infotainment',
        ],
        'interior' => [
            'id' => 10,
            'title' => 'Interior',
        ],
        'safety_and_driver_assist' => [
            'id' => 11,
            'title' => 'Safety & Driver Assist',
        ],
        'pickup' => [
            'id' => 12,
            'title' => 'Pickup',
        ],
        'seating_capacity' => [
            'id' => 12,
            'title' => 'Seating Capacity',
        ],
        'vehicle_color' => [
            'id' => 13,
            'title' => 'Vehicle Color',
        ],
    ];
}
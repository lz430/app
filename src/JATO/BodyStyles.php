<?php

namespace DeliverMyRide\JATO;

class BodyStyles
{
    public const ALL = [
        [
            'style' => 'Convertible',
            'icon' => self::BASE_PATH . 'convertible.svg',
        ],
        [
            'style' => 'Coupe',
            'icon' => self::BASE_PATH . 'coupe.svg',
        ],
        [
            'style' => 'Sedan',
            'icon' => self::BASE_PATH . 'sedan.svg',
        ],
        [
            'style' => 'Sport Utility Vehicle',
            'icon' => self::BASE_PATH . 'suv.svg',
        ],
        [
            'style' => 'Wagon',
            'icon' => self::BASE_PATH . 'wagon.svg',
        ],
        [
            'style' => 'Hatchback',
            'icon' => self::BASE_PATH . 'hatchback.svg',
        ],
        [
            'style' => 'Mini Mpv',
            'icon' => '',
        ],
        [
            'style' => 'Cargo Van',
            'icon' => '',
        ],
        [
            'style' => 'Combi',
            'icon' => '',
        ],
        [
            'style' => 'Roadster',
            'icon' => '',
        ],
        [
            'style' => 'Minivan',
            'icon' => self::BASE_PATH . 'minivan.svg',
        ],
        [
            'style' => 'Pickup',
            'icon' => self::BASE_PATH . 'pickup.svg',
        ],
        [
            'style' => 'Passenger Van',
            'icon' => '',
        ],
        [
            'style' => 'Crossover',
            'icon' => self::BASE_PATH . 'crossover.svg',
        ],
        [
            'style' => 'Micro Car',
            'icon' => '',
        ],
        [
            'style' => 'Targa',
            'icon' => '',
        ],
        [
            'style' => 'Chassis Cab',
            'icon' => '',
        ],
        [
            'style' => 'Cutaway',
            'icon' => '',
        ],
        [
            'style' => 'Van',
            'icon' => self::BASE_PATH . 'van.svg',
        ],
    ];

    private const BASE_PATH = '/images/body-styles/';
}

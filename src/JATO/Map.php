<?php

namespace DeliverMyRide\JATO;

class Map
{
    public const BODY_STYLE_MAP = [
        'Coupe' => 'Coupe',
        'Roadster' => 'Coupe',
        'Micro Car' => 'Coupe',
        'Convertible' => 'Convertible',
        'Targa' => 'Convertible',
        'Sedan' => 'Sedan',
        'Sport Utility Vehicle' => 'Sport Utility Vehicle',
        'Crossover' => 'Sport Utility Vehicle',
        'Pickup' => 'Pickup',
        'Chassis Cab' => 'Pickup',
        'Combi' => 'Wagon',
        'Wagon' => 'Wagon',
        'Hatchback' => 'Hatchback',
        'Mini Mpv' => 'Hatchback',
        'Cargo Van' => 'Van',
        'Van' => 'Van',
        'Minivan' => 'Van',
        'Passenger Van' => 'Van',
        'Cutaway' => 'Van',
    ];

    public const BODY_STYLES = [
        'Coupe' => [
            'label' => 'Coupe',
            'style' => 'Coupe',
            'icon' => 'coupe',
        ],
        'Convertible' => [
            'label' => 'Convertible',
            'style' => 'Convertible',
            'icon' => 'convertible',
        ],
        'Hatchback' => [
            'label' => 'Hatchback',
            'style' => 'Hatchback',
            'icon' => 'hatchback',
        ],
        'Sedan' => [
            'label' => 'Sedan',
            'style' => 'Sedan',
            'icon' => 'sedan',
        ],
        'Wagon' => [
            'label' => 'Wagon/Crossover',
            'style' => 'Wagon',
            'icon' => 'wagon',
        ],
        'Sport Utility Vehicle' => [
            'label' => 'SUV',
            'style' => 'Sport Utility Vehicle',
            'icon' => 'suv',
        ],
        'Van' => [
            'label' => 'Van/Minivan',
            'style' => 'Van',
            'icon' => 'minivan',
        ],
        'Pickup' => [
            'label' => 'Pickups',
            'style' => 'Pickup',
            'icon' => 'pickup',
        ],
    ];
}

<?php

namespace DeliverMyRide\JATO;

class BodyStyles
{
    public const ALL = [
        'convertible' => [
            'style' => 'Convertible',
            'subStyles' => [
                'Targa',
            ],
            'icon' => 'convertible',
        ],
        'coupe' => [
            'style' => 'Coupe',
            'subStyles' => [
                'Roadster',
                'Micro Car',
            ],
            'icon' => 'coupe',
        ],
        'sedan' => [
            'style' => 'Sedan',
            'icon' => 'sedan',
        ],
        'sport utility vehicle' => [
            'style' => 'Sport Utility Vehicle',
            'icon' => 'suv',
        ],
        'wagon' => [
            'style' => 'Wagon',
            'subStyles' => [
                'Combi',
            ],
            'icon' => 'wagon',
        ],
        'hatchback' => [
            'style' => 'Hatchback',
            'subStyles' => [
                'Mini Mpv',
            ],
            'icon' => 'hatchback',
        ],
        'cargo van' => [
            'style' => 'Cargo Van',
            'subStyles' => [
                'Cutaway',
            ],
            'icon' => '',
        ],
        'minivan' => [
            'style' => 'Minivan',
            'icon' => 'minivan',
        ],
        'pickup' => [
            'style' => 'Pickup',
            'subStyles' => [
                'Chassis Cab',
            ],
            'icon' => 'pickup',
        ],
        'passenger van' => [
            'style' => 'Passenger Van',
            'subStyles' => [
                'Van',
            ],
            'icon' => '',
        ],
        'crossover' => [
            'style' => 'Crossover',
            'icon' => 'crossover',
        ],
    ];
}

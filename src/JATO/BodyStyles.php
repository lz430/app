<?php

namespace DeliverMyRide\JATO;

class BodyStyles
{
    public const ALL = [
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
        'convertible' => [
            'style' => 'Convertible',
            'subStyles' => [
                'Targa',
            ],
            'icon' => 'convertible',
        ],
        'wagon' => [
            'style' => 'Wagon',
            'subStyles' => [
                'Combi',
                'Crossover',
            ],
            'icon' => 'wagon',
        ],
        'hatchback' => [
            'style' => 'Hatchback',
            'subStyles' => [
                'Mini Mpv',
                'Crossover',
            ],
            'icon' => 'hatchback',
        ],
        'pickup' => [
            'style' => 'Pickup',
            'subStyles' => [
                'Chassis Cab',
            ],
            'icon' => 'pickup',
        ],
        'van' => [
            'style' => 'Van',
            'subStyles' => [
                'Van',
                'Minivan',
                'Passenger Van',
                'Cutaway',
            ],
            'icon' => 'minivan',
        ],
        'sport utility vehicle' => [
            'style' => 'Sport Utility Vehicle',
            'subStyles' => [
                'Crossover',
            ],
            'icon' => 'suv',
        ],
    ];
}

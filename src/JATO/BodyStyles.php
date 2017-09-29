<?php

namespace DeliverMyRide\JATO;

class BodyStyles
{
    public const ALL = [
        'coupe' => [
            'label' => 'Coupe (2 Door)',
            'style' => 'Coupe',
            'subStyles' => [
                'Roadster',
                'Micro Car',
            ],
            'icon' => 'coupe',
        ],
        'sedan' => [
            'label' => 'Sedan (4 Door)',
            'style' => 'Sedan',
            'icon' => 'sedan',
        ],
        'convertible' => [
            'label' => 'Convertible',
            'style' => 'Convertible',
            'subStyles' => [
                'Targa',
            ],
            'icon' => 'convertible',
        ],
        'wagon' => [
            'label' => 'Crossover/Wagon',
            'style' => 'Wagon',
            'subStyles' => [
                'Combi',
                'Crossover',
            ],
            'icon' => 'wagon',
        ],
        'hatchback' => [
            'label' => 'Hatchback',
            'style' => 'Hatchback',
            'subStyles' => [
                'Mini Mpv',
            ],
            'icon' => 'hatchback',
        ],
        'pickup' => [
            'label' => 'Pickup',
            'style' => 'Pickup',
            'subStyles' => [
                'Chassis Cab',
            ],
            'icon' => 'pickup',
        ],
        'van' => [
            'label' => 'Van/Minivan',
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
            'label' => 'Sport Utility Vehicle',
            'style' => 'Sport Utility Vehicle',
            'subStyles' => [
                'Crossover',
            ],
            'icon' => 'suv',
        ],
    ];
}

<?php

namespace DeliverMyRide\JATO;

class BodyStyles
{
    public const ALL = [
        'coupe' => [
            'label' => 'Coupe',
            'style' => 'Coupe',
            'subStyles' => [
                'Roadster',
                'Micro Car',
            ],
            'icon' => 'coupe',
        ],
        'convertible' => [
            'label' => 'Convertible',
            'style' => 'Convertible',
            'subStyles' => [
                'Targa',
            ],
            'icon' => 'convertible',
        ],
        'hatchback' => [
            'label' => 'Hatchback',
            'style' => 'Hatchback',
            'subStyles' => [
                'Mini Mpv',
            ],
            'icon' => 'hatchback',
        ],
        'sedan' => [
            'label' => 'Sedan',
            'style' => 'Sedan',
            'icon' => 'sedan',
        ],

        'wagon' => [
            'label' => 'Wagon/Crossover',
            'style' => 'Wagon',
            'subStyles' => [
                'Combi',
                'Crossover',
            ],
            'icon' => 'wagon',
        ],
        'sport utility vehicle' => [
            'label' => 'SUV',
            'style' => 'Sport Utility Vehicle',
            'subStyles' => [
                'Crossover',
            ],
            'icon' => 'suv',
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
        'pickup' => [
            'label' => 'Pickups',
            'style' => 'Pickup',
            'subStyles' => [
                'Chassis Cab',
            ],
            'icon' => 'pickup',
        ],
    ];
}

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
        'sedan' => [
            'label' => 'Sedan',
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
            'label' => 'Wagon / Crossover',
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
                'Crossover',
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
            'label' => 'Van / Minivan',
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
            'label' => 'SUV',
            'style' => 'Sport Utility Vehicle',
            'subStyles' => [
                'Crossover',
            ],
            'icon' => 'suv',
        ],
    ];
}

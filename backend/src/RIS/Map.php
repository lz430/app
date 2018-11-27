<?php

namespace DeliverMyRide\RIS;

class Map
{
    public const REGIONS = [
        'detroit' => '48116',
    ];

    public const TRANSMISSION_MAP = [
        'Automatic' => 'AT',
        'Manual' => 'MT',
    ];

    public const MODEL_MAP = [
        'BY_MODEL' => [
            //
            // Audi
            'A5 Sportback' => 'A5',
            'A5 Coupe' => 'A5',
            'S5 Sportback' => 'S5',
            'A3 Sedan' => 'A3',
            'A4 allroad', 'allroad',

            // Rams
            'Ram 1500 Pickup' => '1500',
            'Ram 1500 Classic' => '1500',

            // Caddys
            'ATS Sedan' => 'ATS',
            'ATS Coupe' => 'ATS',
            'CTS Sedan' => 'CTS',
            'CTS-V Sedan' => 'CTS-V',
            'CTS-V Coupe' => 'CTS-V',

            // Benz (Really trims)
            'C300' => 'C 300',
            'E300' => 'E 300',
            'E400' => 'E 400',
            'GLA250' => 'GLA 250',
            'CLA250' => 'CLA 250',
            'GLC300' => 'GLC 300',
            'GLE350' => 'GLE 350',
            'AMG® GLE43' => 'AMG GLE 43',
            'GLS450' => 'GLS 450',
            'GLS550' => 'GLS 550',
            'AMG® GLS63' => 'AMG GLS 63',

            // GMC
            'Sierra 1500 Denali' => 'Sierra 1500',

            // Jeep
            'All-New Wrangler Unlimited' => 'Wrangler Unlimited',
            'All-New Wrangler' => 'Wrangler',

            // Toyota
            'Yaris' => 'Yaris Sedan',

            // Hyundai
            'Ioniq' => 'Ioniq Hybrid',

            // Honda
            'Civic Hatchback' => 'Civic',
            'Clarity Plug-In Hybrid' => 'Clarity',

            // Lexus
            'LS 500' => 'LS',

            // Infiniti
            'Q60 Coupe' => 'Q60',

            // BMW
            'M3' => 'M3 Sedan',
            'M2' => 'M2 Coupe',
        ],

        'BY_MODEL_AND_TRIM' => [
            // BMW
            '2 Series' => [
                '230i' => '230',
                'M240i' => 'M240',
            ],
            '3 Series' => [
                '320i' => '320',
                '328d' => '328d',
                '330i' => '330',
                '330e' => '330e',
                '340i' => '340',
            ],
            '4 Series' => [
                '430i' => '430',
                '440i' => '440',
            ],
            '5 Series' => [
                '530e' => '530e',
                '540e' => '540e',
                '530i' => '530',
                '540i' => '540',
                'M550i' => 'M550',
            ],
            '6 Series Gran Turismo' => [
                '640i' => '640',
            ],
            '7 Series' => [
                '740i' => '740',
                '750i' => '750',
            ],

        ],
        'BY_MODEL_AND_TRIM_AND_NAME' => [
            'MDX' => [
                'Advance Package' => [
                    'Sport Hybrid SH-AWD w/Advance Package' => 'MDX Sport Hybrid'
                ],
            ],
            'S90' => [
                'Inscription' => [
                    'T8 Inscription PHEV AWD' => 'S90 Hybrid',
                ],
            ],
            '718' => [
                'S' => [
                    'Cayman S' => '718 Cayman'
                ]
            ],

            //
            // Lexus
            'ES' => [
                '350' => [
                    '350' => 'ES 350',
                    'ES 350' => 'ES 350',
                ],
                '300h' => [
                    'ES 300h' => 'ES 300h',
                ],
                '300h Luxury' => [
                    '300h Luxury' => 'ES 300h',
                ],
                '350 Luxury' => [
                    '350 Luxury' => 'ES 350',
                ],
                'F SPORT' => [
                    'ES 350 F SPORT' => 'ES 350',
                ]
            ],
            'RC' => [
                'F' => [
                    'F' => 'RC F',
                ],
                '300' => [
                    '300 AWD' => 'RC 300',
                ],
                '350' => [
                    '350 AWD' => 'RC 350',
                ],
            ],
            'RX' => [
                '350' => [
                    '350 AWD' => 'RX 350',
                    '350L AWD' => 'RX 350l',
                ],
                'LUXURY' => [
                    '350L LUXURY AWD' => 'RX 350l',
                ],
                '450h' => [
                    '450h AWD' => 'RX 450h',
                ],
                '450hL LUXURY' => [
                    '450hL LUXURY AWD' => 'RX 450hL',
                ],
                '350 F SPORT' => [
                    '350 F SPORT AWD' => 'RX 350',
                ]
            ],
            'NX' => [
                '300' => [
                    '300 AWD' => 'NX 300',
                    '300 RWD' => 'NX 300',
                ],
                '300h' => [
                    '300h AWD' => 'NX 300h',
                ],
                '300 F SPORT' => [
                    '300 F SPORT AWD' => 'NX 300',
                ]
            ],
            'IS' => [
                '300' => [
                    '300 AWD' => "IS 300",
                ],
                '350' => [
                    '350 AWD' => "IS 350",
                ],
            ],
            'GX' => [
                'Base' => [
                    '460' => "GX 460",
                ],
                'LUXURY' => [
                    '460 LUXURY' => "GX 460",
                ],
            ],
            'GS' => [
                'F' => [
                    'F' => 'GS F',
                ],
                '350' => [
                    '350 F SPORT AWD' => 'GS 350',
                ]
            ],
            'LC' => [
                '500' => [
                    '500' => "LC 500",
                ],
            ],
            'LS' => [
                'Base' => [
                    '500 AWD' => 'LS 500',
                    '500 F SPORT AWD' => 'LS 500',
                ],
                '500h' => [
                    '500h AWD' => "LS 500h",
                ],
            ],
            'LX' => [
                '570' => [
                    '570 THREE-ROW' => "LX 570",
                    '570 TWO-ROW' => "LX 570",
                ],
            ],
        ],
    ];

    // lol.
    public const MAKES_USE_TRIM_FOR_MODEL = [
        'Mercedes-Benz',
    ];


    /**
     *  <Make> -> <Model> -> <Trim> -> <Name>
     */
    public const TRIM_MAP = [
        'Jeep' => [
            'Grand Cherokee' => [
                'Altitude' => '2BZ',
                'High Altitude' => '2BS'
            ]
        ],
        'Acura' => [
            'MDX' => [
                'Base' => '3.5L',
                'Technology Package' => '3.5L w/Technology Pkg',
                'Technology & Entertainment Package' => '3.5L w/Technology & Entertainment Pkgs',
                'Advance and Entertainment Package' => '3.5L w/Advance & Entertainment Pkgs',
                'Advance Package' => [
                    'Sport Hybrid SH-AWD w/Advance Package' => '3.0L w/Advance Package',
                    'SH-AWD w/Advance Package' => '3.5L w/Advance Package',
                ],
            ],
        ],
        'Hyundai' => [
            'Elantra GT' => [
                'GT' => 'Base',
                'GT Sport' => 'Sport',
            ],
        ],
        'BMW' => [
            '2 Series' => [
                '230i' => [
                    '230i Sedan' => 'i',
                    '230i xDrive Sedan' => 'i xDrive',
                ],
            ],
            '3 Series' => [
                '340i' => [
                    '340i Sedan' => 'i',
                    '340i xDrive Sedan' => 'i xDrive',
                ],
                '320i' => [
                    '320i Sedan' => 'i',
                    '320i xDrive Sedan' => 'i xDrive',
                ],
                '330i' => [
                    '330i Sedan' => 'i',
                    '330i xDrive Sedan' => 'i xDrive',
                ],
            ],
        ],
        'BY_TRIM' => [

            // RAM
            'Big Horn' => 'Big Horn/Lone Star',

            // Volvo
            'T6 AWD Momentum' => 'T6 Momentum',
            'T5 AWD Momentum' => 'T5 Momentum',
            'T6 Momentum AWD' => 'T6 Momentum',
            'T5 Momentum AWD' => 'T5 Momentum',
            'T6 Inscription AWD' => 'T6 Inscription',
            'T5 AWD Inscription' => 'T5 Inscription',
            'T8 Inscription PHEV AWD' => 'T8 Inscription',
            'T8 Twin Engine Plug-in Inscription' => 'T8 Inscription',
            'T6 AWD Inscription' => 'T6 Inscription',
            'T5 Inscription AWD' => 'T5 Inscription',
            'T6 R-Design AWD' => 'T6 R-Design',
            'T5 R-Design AWD' => 'T5 R-Design',
            'T6 AWD R-Design' => 'T6 R-Design',
            'T5 AWD' => 'T5',
            'T6 AWD' => 'T6',
        ],
    ];

    public const VEHICLE_MODEL_BLACKLIST = [
        'f-350 super duty',
        'f-450 super duty chassis cab',
        'promaster cargo van',
        'promaster city',
        'nv cargo',
        'transit van',
        'silverado 3500hd',
    ];

    public const DRIVEN_WHEELS_MAP = [
        'BY_VERSION_NAME' => [
            'SEL 4WD' => '4WD',
            'Trailhawk 4x4' => '4WD',
            'Altitude 4WD' => '4WD',
            'High Altitude 4WD' => '4WD',
            'Limited 4x4' => '4WD',
            'Latitude 4x4' => '4WD',
        ],
    ];

    public const DISPLACEMENT_MAP = [
        'BY_VERSION_NAME' => [
            'SEL 4WD' => '1.5',
        ],
    ];

    public const BODY_STYLE_MAP = [
        'BY_BODYSTYLE' => [
            'Sport Utility Vehicle' => "Sport Utility",
            'Pickup' => 'Regular Cab',
            'Minivan' => 'Passenger Van',
        ],
        'BY_MODEL' => [
            'A5 Sportback' => 'Sportback',
            'A5 Coupe' => 'Coupe',
        ],
    ];

    public const CAB_MAP = [
        'Crew' => 'crew cab',
    ];
}
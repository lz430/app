<?php

namespace DeliverMyRide\DataDelivery;

class Map
{
    public const AFFINITY_MAP = [
        'employee' => [
            'Buick' => 1,
            'Chevrolet' => 1,
            'GMC' => 1,
            'Cadillac' => 1,
            'Ford' => 22,
            'Lincoln' => 22,
            'Dodge' => 17,
            'Chrysler' => 17,
            'Jeep' => 17,
            'Ram' => 17,
            'Fiat' => 17,
            'Land Rover' => 66,
        ],
        'supplier' => [
            'Buick' => 65,
            'Chevrolet' => 65,
            'GMC' => 65,
            'Cadillac' => 65,
            'Ford' => 19,
            'Lincoln' => 19,
            'Dodge' => 16,
            'Chrysler' => 16,
            'Jeep' => 16,
            'Ram' => 16,
            'Fiat' => 16,
        ],
    ];

    /**
     * primary roles.
     */
    public const PRIMARY_ROLES = [
        'default',
        'employee',
        'supplier',
    ];

    /**
     * TODO: Maybe we don't even need this?
     */
    public const SHORT_CONDITIONS_TO_CONDITIONALS = [
        'd' => 'default',
        'e' => 'employee',
        's' => 'supplier',
        'col' => 'college',
        'mil' => 'military',
        'con' => 'conquest',
        'loy' => 'loyal',
        'resp' => 'responder',
        'gmcomp' => 'gmcompetitive',
        'gmlease' => 'gmlease',
        'cadlease' => 'cadillaclease',
        'cadloyal' => 'cadillacloyalty',
    ];

    public const ROLE_TO_PROGRAM_NAME = [
        'employee' => [
            'ccr for gm employee',
            'cadillac ccr for eligible gm',
        ],
        'supplier' => [
            'ccr for gm employee',
        ],
    ];

    public const CONDITIONALS_TO_PROGRAM_NAME = [
        'college' => [
            'college',
        ],
        'military' => [
            'military',
        ],
        'conquest' => [
            'conquest lease',
            'conquest bonus',
        ],
        'loyal' => [
            'returning lessee',
        ],
        'responder' => [
            'first responder',
        ],
        'gmcompetitive' => [
            'gm competitive lease private offer',
        ],
        'gmlease' => [
            'gm lease loyalty towards lease',
        ],
        'cadillaclease' => [
            'cadillac lease loyalty towards',
        ],
        'cadillacloyalty' => [
            'cadillac loyalty towards',
        ],
    ];
}

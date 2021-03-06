<?php

namespace DeliverMyRide\Fuel;

class Map
{
    public const MODEL_MAP = [
        'A3 Sedan' => 'A3',
        'A3 Cabriolet' => 'A3',
        'A5 Coupe' => 'A5',
        'A8' => 'A8 L',
        'allroad' => 'A4 allroad',
        '6 Series Gran Turismo' => '6-series',
        'M2 Coupe' => '2-series',
        'M3 Sedan' => '3-series',
        'AMG® GT Roadster' => 'AMG GT',
        'ATS Sedan' => 'ATS',
        'ATS-V Sedan' => 'ATS-V',
        'CTS Sedan' => 'CTS',
        'ATS Coupe' => 'ATS',
        'CTS-V Sedan' => 'CTS-V',
        'Corvette' => 'Corvette Grandsport',
        'Express Cargo' => 'Express 2500 Cargo',
        'Wrangler JK' => 'Wrangler',
        'Wrangler JK Unlimited' => 'Wrangler Unlimited',
        'All-New Wrangler' => 'Wrangler',
        'All-New Wrangler Unlimited' => 'Wrangler Unlimited',
        'Silverado 2500HD' => 'Silverado 2500HD',
        'Ram 1500 Pickup' => '1500',
        'Ram 2500 Pickup' => '2500',
        'Ram 3500 Pickup' => '3500',
        'C-Max' => 'C-Max Hybrid',
        'Transit Van ' => 'Transit Van 150',
        'F-250 Super Duty' => 'F-250 SD',
        'F-350 Super Duty' => 'F-350 SD DRW',
        'Transit Connect' => 'Transit Connect Van',
        'Sierra 1500 Denali' => 'Sierra 1500',
        'Sierra 2500 Denali HD' => 'Sierra 2500 HD',
        'Clarity' => 'Clarity Plug-In Hybrid',
        'Ioniq' => 'Ioniq Hybrid',
        'Q60 Coupe' => 'Q60',
        'All-New Compass' => 'Compass',
        'AMG GT Coupe' => 'AMG GT',
        'C-Class Coupe' => 'C-Class',
        'C-Class Sedan' => 'C-Class',
        'CLA' => 'CLA-Class',
        'E-Class' => 'E-Class',
        'SL Roadster' => 'SL-Class',
        'NV200' => 'NV200 Compact Cargo',
        'NV Cargo' => 'NV200 Compact Cargo',
        'NV Passenger' => 'NV Passenger',
        'NV 3500 Passenger' => 'NV Passenger',
        'Rogue Sport' => 'Rogue',
        'Versa Sedan' => 'Versa',
        '718' => '718 Boxster',
        '719' => '719 Boxster',
        'Prius Prime' => 'Prius',
        'Yaris iA' => 'Yaris iA',
        'Tiguan Limited' => 'Tiguan',
        'Golf' => 'Golf GTI',
        'ProMaster Cargo Van' => 'ProMaster 2500',
    ];

    public const TRIM_MAP = [
        'BY_MODEL' => [
            'Sierra 1500 Denali' => 'Denali',
            'M2 Coupe' => 'M2',
            'M3 Sedan' => 'M3',
        ],
        'BY_TRIM' => [
            'Sport S' => 'Sport',
        ],
    ];

    public const HEX_MAP = [
        'Black' => '#000000',
        'White' => '#FFFFFF',
        'Gray' => '#A5A5A5',
        'Silver' => '#D9D9D9',
        'Red' => '#FF0000',
        'Blue' => '#0000FF',
        'Green' => '#009933',
        'Tan' => '#FFFFCC',
        'Beige' => '#FFFFCC',
        'Burgandy' => '#990000',
        'Orange' => '#FF6600',
        'Brown' => '#663300',
        'Purple' => '#660066',
        'Yellow' => '#FFFF00',
    ];

    /**
     * <Manufacturer Color -> <Simple color>
     * Note: This is not an exact match! we are using str_contains to compare.
     *   So if it's better to maintain 'Black' => 'Black' and not each mfg name
     *   that includes black.
     */
    public const COLOR_MAP = [
        'Abyss' => 'Black',
        'Billet Clearcoat' => 'Black',
        'Black' => 'Black',
        'Ebony Twilight Metallic' => 'Black',
        'Midnight' => 'Black',
        'Nero Cinema (Black Clear Coat)' => 'Black',
        'Nero Puro (Straight Black)' => 'Black',
        'Obsidian' => 'Black',
        'Velvet' => 'Black',
        'Aqua' => 'Blue',
        'Arctic Blue' => 'Blue',
        'B5 Blue Pearlcoat' => 'Blue',
        'Blu By You Pearlcoat' => 'Blue',
        'Blue' => 'Blue',
        'Bluestone' => 'Blue',
        'Brst Bl Met' => 'Blue',
        'Gal Aqu Met' => 'Blue',
        'Mediterranean B' => 'Blue',
        'Sapph' => 'Blue',
        'Silk' => 'Blue',
        'Basalto Brown Metallic' => 'Brown',
        'Blkish Bwn Met' => 'Brown',
        'Brown' => 'Brown',
        'Brwnstn' => 'Brown',
        'Cinamon Bwn Prl' => 'Brown',
        'Cordovan' => 'Brown',
        'Dark Cordovan Pearlcoat' => 'Brown',
        'Espresso' => 'Brown',
        'Havana Metallic' => 'Brown',
        'Java Metallic' => 'Brown',
        'Light Brownstone Pearlcoat' => 'Brown',
        'Mocha' => 'Brown',
        'Mocha Metallic' => 'Brown',
        'Smoked Mesquite' => 'Brown',
        'Walnut' => 'Brown',
        'Black Currant' => 'Burgandy',
        'Burgundy' => 'Burgandy',
        'Agate Gray Metallic' => 'Gray',
        'Alloy Metallic' => 'Gray',
        'Anvil' => 'Gray',
        'Bruiser Gray Clearcoat' => 'Gray',
        'Crystal Metallic' => 'Gray',
        'Dark Granite' => 'Gray',
        'Dark Granite Metallic' => 'Gray',
        'Dark Slate Metallic' => 'Gray',
        'Daytona Gray Pearl Effect' => 'Gray',
        'Daytona Gray Pearl Effect/Black Roof' => 'Gray',
        'Galactic Gray' => 'Gray',
        'Granite' => 'Gray',
        'Granite Clearcoat' => 'Gray',
        'Granite Clearcoat Metallic' => 'Gray',
        'Granite Crystal Metallic Clearcoat' => 'Gray',
        'Granite Metallic' => 'Gray',
        'Granite Pearlcoat' => 'Gray',
        'Graphite' => 'Gray',
        'Graphite Gray Metallic' => 'Gray',
        'Graphite Metallic' => 'Gray',
        'Graphite Shadow' => 'Gray',
        'Gray' => 'Gray',
        'Grey' => 'Gray',
        'Gun Met' => 'Gray',
        'Gun Metallic' => 'Gray',
        'Gunmetal' => 'Gray',
        'Iridium' => 'Gray',
        'Lead Foot' => 'Gray',
        'Magnetic' => 'Gray',
        'Maximum Steel Metallic Clearcoat' => 'Gray',
        'Modern St Met' => 'Gray',
        'Modern Steel' => 'Gray',
        'Modern Stl Met' => 'Gray',
        'Monsoon Gray Metallic' => 'Gray',
        'Osmium Gray Metallic' => 'Gray',
        'Pepperdust Metallic' => 'Gray',
        'Pewter' => 'Gray',
        'Pewter Metallic' => 'Gray',
        'Phantom Gray' => 'Gray',
        'Pine Gray Metallic' => 'Gray',
        'Platinum Gray Metallic' => 'Gray',
        'Quartz Gray Metallic' => 'Gray',
        'Rhino Clearcoat' => 'Gray',
        'Satin Steel Gray Metallic' => 'Gray',
        'Shadow' => 'Gray',
        'Slate' => 'Gray',
        'Smoke' => 'Gray',
        'Steel' => 'Gray',
        'Steel Metallic' => 'Gray',
        'Sting-Gray Clearcoat' => 'Gray',
        'Stone Gray' => 'Gray',
        'Stone Gray Metallic' => 'Gray',
        'Thunder Gray' => 'Gray',
        'Tornado Gray Metallic' => 'Gray',
        'Vesuvio Gray Metallic' => 'Gray',
        'Volcano Gray' => 'Gray',
        'Mojito! Clearcoat' => 'Green',
        'Moss' => 'Green',
        'Olive' => 'Green',
        'Olive Green' => 'Green',
        'Olive Green Pearlcoat' => 'Green',
        'Pine' => 'Green',
        'Sea Glass Prl' => 'Green',
        'Sea Green' => 'Green',
        'Shoreline Mist' => 'Green',
        'Verde Visconti Metallic' => 'Green',
        'Canyon Ridge' => 'Orange',
        'Copper' => 'Orange',
        'Copper Pearlcoat' => 'Orange',
        'Coppertino Metallic' => 'Orange',
        'Go Mango!' => 'Orange',
        'Magnetico Bronze Metallic' => 'Orange',
        'Orange' => 'Orange',
        'Punkn Metallic Clearcoat' => 'Orange',
        'Spitfire Orange Clearcoat' => 'Orange',
        'Sunshine Oran' => 'Orange',
        'Deep Amethyst' => 'Purple',
        'Plum Crazy Pearlcoat' => 'Purple',
        'Violet' => 'Purple',
        'Ablaze' => 'Red',
        'Alfa Rosso' => 'Red',
        'Barcelona Red' => 'Red',
        'Basque Red' => 'Red',
        'Black Cherry Metallic' => 'Red',
        'Bordeaux' => 'Red',
        'Bright Red' => 'Red',
        'Case IH Red' => 'Red',
        'Cayenne Red Metallic' => 'Red',
        'Chili Pepper Red' => 'Red',
        'Chili Red' => 'Red',
        'Chili Red Metallic' => 'Red',
        'Cinnamon Glaze' => 'Red',
        'Colorado Red' => 'Red',
        'Crimson' => 'Red',
        'Crimson Red' => 'Red',
        'Delmonico Red Pearlcoat' => 'Red',
        'Firecracker Red Clearcoat' => 'Red',
        'Flame Red Clearcoat' => 'Red',
        'Flamenco Red' => 'Red',
        'Fortana Red' => 'Red',
        'Fusion Red' => 'Red',
        'Garnet Red' => 'Red',
        'Hypnotique Red' => 'Red',
        'Iridium Metallic' => 'Red',
        'Jupiter Red' => 'Red',
        'Magma Red' => 'Red',
        'Magnetic Red' => 'Red',
        'Matador Red Metallic' => 'Red',
        'Melbourne Red Metallic' => 'Red',
        'Monza Red Metallic' => 'Red',
        'Octane Red Pearlcoat' => 'Red',
        'Ooh La La Rouge Mica' => 'Red',
        'Ooh Lala Rouge' => 'Red',
        'Pulse Red' => 'Red',
        'Pure Red' => 'Red',
        'Quartz' => 'Red',
        'Race Red' => 'Red',
        'Red' => 'Red',
        'Red Alert' => 'Red',
        'Red Clearcoat' => 'Red',
        'Red Crystal' => 'Red',
        'Red Line' => 'Red',
        'Red Metallic' => 'Red',
        'Red Tintcoat' => 'Red',
        'Redline 2 Coat Pearl' => 'Red',
        'Redline Pearlcoat' => 'Red',
        'Ruby' => 'Red',
        'Ruby Red' => 'Red',
        'Ruby Red Metallic' => 'Red',
        'Salsa Red' => 'Red',
        'Scarlet' => 'Red',
        'Scarlet Red' => 'Red',
        'Soul Red Crystal Metallic' => 'Red',
        'Sport Red' => 'Red',
        'Tango Red Metallic' => 'Red',
        'Torch Red' => 'Red',
        'Toreador Red' => 'Red',
        'Tornado Red' => 'Red',
        'Torred' => 'Red',
        'Torred Clearcoat' => 'Red',
        'Velvet Red Pearlcoat' => 'Red',
        'Venetian' => 'Red',
        'Billet Argento (Silver)' => 'Silver',
        'Billet Silver Metallic' => 'Silver',
        'Billet Silver Metallic Clearcoat' => 'Silver',
        'Bright Silver Clearcoat Metallic' => 'Silver',
        'Bright Silver Metallic' => 'Silver',
        'Bright Silver Metallic Clearcoat' => 'Silver',
        'Brilliant Silver' => 'Silver',
        'Brilliant Silver Metallic' => 'Silver',
        'Chromium' => 'Silver',
        'Diamond' => 'Silver',
        'Electric Silver Metallic' => 'Silver',
        'Florett Silver Metallic' => 'Silver',
        'Galaxy Silver Metallic' => 'Silver',
        'Glacier Silver Metallic' => 'Silver',
        'GT Silver Metallic' => 'Silver',
        'Ingot Silver' => 'Silver',
        'Ingot Silver Metallic' => 'Silver',
        'Liquid Platinum' => 'Silver',
        'Mist' => 'Silver',
        'Molten Silver' => 'Silver',
        'Moondust' => 'Silver',
        'Platinum' => 'Silver',
        'Quicksilver Metallic' => 'Silver',
        'Radiant Silver' => 'Silver',
        'Radiant Silver Metallic' => 'Silver',
        'Reflex Silver' => 'Silver',
        'Silver' => 'Silver',
        'Silver Ice Metallic' => 'Silver',
        'Silver Metallic' => 'Silver',
        'Silver Sky Metallic' => 'Silver',
        'Sonic Silver Metallic' => 'Silver',
        'White Silver Metallic' => 'Silver',
        'Almond' => 'Tan',
        'Atlas Cedar Met' => 'Tan',
        'Beige' => 'Beige',
        'Bronze' => 'Beige',
        'Champagne' => 'Beige',
        'Gobi Clearcoat' => 'Beige',
        'Mineral / Beige' => 'Beige',
        'Mineral Beige Pearl' => 'Beige',
        'Quicksand' => 'Beige',
        'Sandy Ridge Metallic' => 'Beige',
        'White / Gold' => 'White',
        'Alpine' => 'White',
        'Alpine White' => 'White',
        'Aspen White' => 'White',
        'Bellanova White Pearl' => 'White',
        'Bianco Gelato (White Clear Coat)' => 'White',
        'Blizzard Pearl' => 'White',
        'Bright White' => 'White',
        'Bright White Clearcoat' => 'White',
        'Brilliante White' => 'White',
        'Carrara White' => 'White',
        'Ceramic White' => 'White',
        'Chalk' => 'White',
        'Fresh Powder' => 'White',
        'Frost' => 'White',
        'Frozen White' => 'White',
        'Glacier Metallic' => 'White',
        'Ivory' => 'White',
        'Ivory Pearl' => 'White',
        'Majestic' => 'White',
        'Mineral White Metallic' => 'White',
        'Monaco' => 'White',
        'Moonglow' => 'White',
        'Moonstone' => 'White',
        'Oxford White' => 'White',
        'Pearl' => 'White',
        'Pearl Metallic' => 'White',
        'White' => 'White',
        'Amg Slrbm Yl Mt' => 'Yellow',
        'Giallo Moderna Perla (Pearl Yellow Tri-Coat)' => 'Yellow',
        'Hellayella Clearcoat' => 'Yellow',
        'Yellow' => 'Yellow',
    ];

    public const BODY_STYLE_MAP = [
        'sport utility vehicle' => 'SUV',
    ];
}

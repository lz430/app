const modelNameMap = {
    'A3 Sedan': 'A3',
    'A5 Coupe': 'A5',
    'A8': 'A8 L',
    'Allroad': 'A4 allroad',
    '6 Series Gran Turismo': '6-series',
    'ATS Sedan': 'ATS',
    'ATS-V Sedan': 'ATS-V',
    'CTS Sedan': 'CTS',
    'ATS Coupe': 'ATS',
    'CTS-V Sedan': 'CTS-V',
    'Corvette': 'Corvette Grandsport',
    'Express Cargo': 'Express 2500 Cargo',
    'Express Cargo': 'Express 2500 Cargo',
    'Silverado 2500HD': 'Silverado 2500HD',
    'Ram 2500 Pickup': '2500',
    '500c': '500c',
    'C-Max': 'C-Max Hybrid',
    'Transit Van ': 'Transit Van 150',
    'F-250 Super Duty': 'F-250 SD',
    'F-350 Super Duty': 'F-350 SD DRW',
    'Transit Van ': 'Transit Van 150',
    'Sierra 1500 Denali ': 'Sierra 1500',
    'Sierra 2500 Denali HD': 'Sierra 2500 HD',
    'Clarity': 'Clarity Plug-In Hybrid',
    'Ioniq': 'Ioniq Hybrid',
    'Q60 Coupe': 'Q60',
    'All-New Compass': 'Compass',
    'AMG GT Coupe': 'AMG GT',
    'C-Class Coupe': 'C-Class',
    'C-Class Sedan': 'C-Class',
    'CLA': 'CLA-Class',
    'CLA': 'CLA-Class',
    'E-Class': 'E-Class',
    'SL Roadster': 'SL-Class',
    'NV Cargo': 'NV200 Compact Cargo',
    'NV Passenger': 'NV 3500 Passenger',
    'Rogue Sport': 'Rogue',
    'Versa Sedan': 'Versa',
    '718': '718 Boxter',
    '718': '719 Boxter',
    'Prius Prime': 'Prius',
    'Yaris iA': 'Yaris iA',
    'Tiguan Limited': 'Tiguan',
    'Golf': 'Golf GTI',
};

const fuelModelName = {
    convert: modelNameString => {
        return modelNameMap[modelNameString] || modelNameString;
    }
};

export default fuelModelName;

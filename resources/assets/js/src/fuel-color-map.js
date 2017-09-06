import R from 'ramda';

const colorMap = {
    blue: [
        'Blue',
        'Blue Pearl',
        'Blue Streak',
        'Chief Clearcoat',
        'Cosmos Blue',
        'Dark Blue Pearl Metallic',
        'Graphite Blue Metallic',
        'Laser Blue',
        'True Blue',
    ],

    black: [
        'Black',
        'Black',
        'Black Clearcoat',
        'Black Crystal',
        'Black Granite Metallic',
        'Brilliant Black',
        'Brilliant Black Crystal Pearlcoat',
        'Gloss Black',
        'Diamond Black',
        'Pitch Black',
        'Pitch Black Clearcoat',
        'Super Black',
        'Tuxedo Black Metallic',
    ],

    red: [
        'Red',
        'Candy Red Metallic Tinted Clearcoat',
        'Cherry',
        'Colorado Red',
        'Deep Cherry Red Crystal',
        'Deep Ruby Metallic',
        'Flame Red Clearcoat',
        'Race Red',
        'Red',
        'Red Clearcoat',
        'Red Line',
        'Redline 2 Coat Pearl',
        'Redline Red',
        'Toreador Red',
        'Ruby Flare Pearl',
        'Velvet',
    ],

    orange: ['Orange'],

    purple: ['Purple'],

    green: [
        'Green',
        'Hypergreen Clearcoat',
        'Natural Green Pearlcoat',
        'Olive Green',
    ],

    gray: [
        'Gray',
        'Dark Cordovan Pearl',
        'Cordovan',
        'Gray Clearcoat',
        'Mineral Gray Metallic Clearcoat',
        'Slate Gray Metallic',
        'Sterling Gray Metallic',
        'Granite',
        'Granite Clearcoat Metallic',
        'Granite Crystal Metallic Clearcoat',
        'Grante Crys Met',
        'Crystal Metallic',
        'Glacier Metallic',
        'Smokestone Metallic',
        'Tungsten Metallic',
        'Light Graystone Pearlcoat',
        'Steel Metallic',
        'Rhino Clearcoat',
    ],

    white: [
        'White',
        'Alpine White',
        'Anvil',
        'Arctic White',
        'Bright White',
        'Bright White Clearcoat',
        'Champagne Pearlcoat',
        'White Clearcoat',
        'White Gold Clearcoat',
        'Lunar White Tri-Coat Pearl',
        'Stone White Clearcoat',
        'Ivory',
    ],

    yellow: ['Yellow', 'Baja Yellow', 'Solar Yellow', 'Yellow Jacket'],

    silver: [
        'Silver',
        'Billet Clearcoat',
        'Billet Metallic',
        'Billet Silver Metallic',
        'Billet Silver Metallic Clearcoat',
        'Bright Silver Clearcoat Metallic',
        'Bright Silver Metallic Clearcoat',
        'Ingot Silver Metallic',
        'Molten Silver',
        'Silver Birch',
    ],

    brown: [
        'Brown',
        'Brown Metallic',
        'Gobi Clearcoat',
        'Light Brownstone Pearlcoat',
        'Mocha Steel Metallic',
    ],
};

const fuelColor = {
    convert: colorString => {
        return (
            R.keys(
                R.filter(function(item) {
                    return R.contains(colorString, item);
                }, colorMap)
            )[0] || 'white'
        );
    },
};

export default fuelColor;

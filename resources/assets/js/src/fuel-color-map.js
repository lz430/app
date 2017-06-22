import R from 'ramda';

const colorMap = {
    red: [
        'Velvet',
        'Colorado Red',
        'Flame Red Clearcoat',
        'Ruby Flare Pearl',
        'Deep Cherry Red Crystal',
    ],
    black: ['Diamond Black'],
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

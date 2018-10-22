/**
 * TODO: These need to be made into react components!
 * @type {{dealYearMake: (function(*): string), dealModelTrim: (function(*): string), dealColors: (function(*): string), dealUpholsteryType: strings.dealUpholsteryType}}
 */
const strings = {
    dealYearMake: deal => {
        return `${deal.year} ${deal.make}`;
    },

    dealModelTrim: deal => {
        return `${deal.model} ${deal.series}`;
    },

    dealColors: deal => {
        return `${deal.color}, ${deal.interior_color}`;
    },

    dealUpholsteryType: deal => {
        if (!deal.dmr_features.length) {
            return '';
        }

        const upholsteryType = deal.dmr_features.find(feature => {
            return (
                feature.slug && feature.slug.includes('seat_main_upholstery_')
            );
        });

        if (!upholsteryType) {
            return '';
        }

        return upholsteryType['title'];
    },
};

export default strings;

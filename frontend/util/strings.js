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
        if (!deal.seating_materials) {
            return '';
        }

        return deal.seating_materials;
    },
};

export default strings;

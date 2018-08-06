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
};

export default strings;

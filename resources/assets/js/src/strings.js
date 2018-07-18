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

    toTitleCase: str => {
        return str.replace(/\w+/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
};

export default strings;

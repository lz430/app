const strings = {
    dealYearMake: deal => {
        return `${deal.year} ${deal.make}`;
    },

    dealModelTrim: deal => {
        return `${deal.model} ${deal.series}`;
    },

    toTitleCase: str => {
        return str.replace(/\w+/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
};

export default strings;

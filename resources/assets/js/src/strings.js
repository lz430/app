const strings = {
    dealFullTitle: deal => {
        return this.dealYearMake(deal) + ' ' + this.dealModelTrim(deal);
    },

    dealYearMake: deal => {
        return `${deal.year} ${deal.make}`;
    },

    dealModelTrim: deal => {
        return `${deal.model} ${deal.series}`;
    },
};

export default strings;

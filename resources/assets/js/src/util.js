import R from 'ramda';
import qs from 'qs';

const util = {
    windowIsLargerThanSmall: width => {
        // variables.scss; $break-small: 576px;
        return width > 576;
    },
    windowIsLargerThanMedium: width => {
        // variables.scss; $break-medium: 768px;
        return width > 768;
    },
    moneyFormat: num => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        });

        return formatter.format(num);
    },
    toggleItem: (items, item) => {
        return R.contains(item, items)
            ? R.reject(R.equals(item), items)
            : R.append(item, items);
    },
    getInitialBodyStyleFromUrl: () => {
        return R.prop('style', qs.parse(window.location.search.slice(1)));
    },
    wasReferredFromHomePage: () => {
        let temp = document.createElement('a');

        temp.href = document.referrer;

        return window.document.origin === temp.origin && temp.pathname === '/';
    },
    numbersWithCommas: num => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
        });

        return formatter.format(num);
    },
};

export default util;

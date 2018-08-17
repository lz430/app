import * as R from 'ramda';
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
        // Older browser don't support this.
        if (typeof Intl.NumberFormat === 'function') {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
            });
            return formatter.format(Math.round(num));
        } else {
            return Math.round(num);
        }
    },
    toggleItem: (items, item) => {
        return R.contains(item, items)
            ? R.reject(R.equals(item), items)
            : R.append(item, items);
    },

    getInitialBodyStyleFromUrl: () => {
        return R.prop('style', qs.parse(window.location.search.slice(1)));
    },
    getInitialSizeFromUrl: () => {
        return R.prop('size', qs.parse(window.location.search.slice(1)));
    },
};

export default util;

/**
 *
 * @param needle
 * @param haystack
 * @returns {*}
 */
export const getClosestNumberInRange = (needle, haystack) => {
    // Ensure order of haystack is ascending
    haystack.sort();

    // Bind to lowest or highest.
    if (needle < haystack[0]) {
        return haystack[0];
    } else if (needle > haystack[haystack.length - 1]) {
        return haystack[haystack.length - 1];
    }

    // Exact needle.
    if (R.contains(needle, haystack)) {
        return needle;
    }

    const zipped = R.zip(
        R.reverse(R.tail(R.reverse(haystack))),
        R.tail(haystack)
    );

    // Find closest.
    return R.reduce(
        (closest, [low, high]) => {
            if (closest > low && closest < high) {
                const diffLow = closest - low;
                const diffHigh = high - closest;

                return diffLow > diffHigh ? high : low;
            }

            return closest;
        },
        needle,
        zipped
    );
};

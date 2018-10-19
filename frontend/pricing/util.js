import {
    contains,
    reject,
    equals,
    append,
    zip,
    reverse,
    tail,
    reduce,
} from 'ramda';

/**
 *
 * @param items
 * @param item
 * @returns {*}
 */
export const toggleItem = (items, item) => {
    return contains(item, items)
        ? reject(equals(item), items)
        : append(item, items);
};

/**
 *
 * @param num
 * @returns {*}
 */
export const moneyFormat = num => {
    // Older browser don't support this.
    if (
        typeof Intl !== 'undefined' &&
        typeof Intl.NumberFormat === 'function'
    ) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        });
        return formatter.format(Math.round(num));
    } else {
        return Math.round(num);
    }
};

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
    if (contains(needle, haystack)) {
        return needle;
    }

    const zipped = zip(reverse(tail(reverse(haystack))), tail(haystack));

    // Find closest.
    return reduce(
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

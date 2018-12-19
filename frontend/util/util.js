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
import config from '../core/config';

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

export const buildStaticImageUrl = path => {
    let prefix;
    if (config.REACT_APP_ENVIRONMENT === 'production') {
        prefix = 'https://dmr-prod-static.imgix.net';
    } else if (config.REACT_APP_ENVIRONMENT === 'staging') {
        prefix = 'https://dmr-staging-static.imgix.net';
    } else {
        prefix = '';
    }

    return prefix + path;
};

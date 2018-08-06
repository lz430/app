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
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        });

        return formatter.format(Math.round(num));
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

    getClosestNumberInRange(value, values) {
        // Ensure order of values is ascending
        values.sort();

        // Bind to lowest or highest.
        if (value < values[0]) {
            return values[0];
        } else if (value > values[values.length - 1]) {
            return values[values.length - 1];
        }

        // Exact value.
        if (R.contains(value, values)) {
            return value;
        }

        const zipped = R.zip(
            R.reverse(R.tail(R.reverse(values))),
            R.tail(values)
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
            value,
            zipped
        );
    },
};

export default util;

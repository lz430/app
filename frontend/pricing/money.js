import Dinero from '../node_modules/dinero.js/build/cjs/dinero';

export const zero = new Dinero({ amount: 0 });

/**
 * Create Dinero from whole dollars with implied cents
 *
 * Specialized factory to return Dinero assuming
 * the input is in format where cents are not
 * included. (example: 3 or 10,000)
 *
 * @param wholeDollars
 * @returns Dinero
 */
export function fromWholeDollars(wholeDollars) {
    // @todo Implement this directly
    return fromUnknownInput(wholeDollars, 100);
}

/**
 * Create Dinero from dollars and cents
 *
 * Specialized factory to return Dinero assuming
 * the input is in format where cents are
 * included. (example: 3.56 or 1,000.00)
 *
 * @param dollarsAndCents
 * @returns Dinero
 */
export function fromDollarsAndCents(dollarsAndCents) {
    // @todo Implement this directly
    return fromUnknownInput(dollarsAndCents, 100);
}

/**
 * Create Dinero from unknown input
 *
 * Factory to return Dinero making little assumptions about
 * the input. Tests to handle various formats, including
 * ints, floats, formatted currency ($3.54), existing
 * Dinero instances, and Dinero's object type
 * ({amount}) will try to resolve the value
 * to a proper amount to be used for the
 * creation of a brand new Dinero.
 *
 * The multiplier parameter is used to aid in "upcasting"
 * numbers to be subunit-less values used for Dinero
 * amounts. For example, "10.35" should be
 * multiplied by 100 to get the proper
 * Dinero amount of 1035.
 *
 * @param moneyValue
 * @param multiplier
 * @returns {*}
 */
export function fromUnknownInput(moneyValue, multiplier = 1) {
    if (
        moneyValue instanceof Object &&
        typeof moneyValue.toFormat === 'function'
    ) {
        return moneyValue.multiply(multiplier);
    }

    if (moneyValue.hasOwnProperty('amount')) {
        return Dinero(moneyValue * multiplier);
    }

    if (Number.isInteger(moneyValue)) {
        return Dinero({ amount: moneyValue * multiplier });
    }

    if (typeof moneyValue === 'number' && !!(moneyValue % 1)) {
        const multiplied = moneyValue * multiplier;
        const truncated =
            multiplied > 0 ? Math.ceil(multiplied) : Math.floor(multiplied);

        return Dinero({ amount: truncated });
    }

    if (typeof moneyValue === 'string') {
        const numberfied = moneyValue.replace(/[,]/g, '');

        if (numberfied.indexOf('.') === -1) {
            return Dinero({ amount: parseInt(numberfied) * multiplier });
        }

        const parsed = parseFloat(numberfied) * multiplier;
        const truncated = parsed > 0 ? Math.ceil(parsed) : Math.floor(parsed);

        return Dinero({ amount: truncated });
    }

    throw new TypeError(
        'Must be an integer, object with an amount key ({amount: XXXX}), or a Dinero instance'
    );
}

/**
 * @deprecated
 */
export function createDineroFromMoneyValue(moneyValue, multiplier = 1) {
    return fromUnknownInput(moneyValue, multiplier);
}

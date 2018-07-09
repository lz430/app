/**
 * Generates a key for a specific quote.
 * @param deal
 * @param zipcode
 * @param paymentType
 * @param role
 * @returns {string}
 */
export const dealQuoteKey = (deal, zipcode, paymentType, role) => {
    if (role === 'dmr' || !role) {
        role = 'default';
    }
    return `${deal.id}-${paymentType}-${zipcode}-${role}`;
};

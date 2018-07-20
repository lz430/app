import R from 'ramda';
import config from 'config';
/**
 * Generates a key for a specific quote.
 * @param deal
 * @param zipcode
 * @param paymentType
 * @param primaryRole
 * @param conditionalRoles
 * @returns {string}
 */
export const dealQuoteKey = (
    deal,
    zipcode,
    paymentType,
    primaryRole,
    conditionalRoles = []
) => {
    const map = config.PRICING_ROLE_MAP;

    if (primaryRole === 'dmr' || !primaryRole) {
        primaryRole = 'default';
    }

    let roles = [primaryRole, ...conditionalRoles];

    roles = R.map(function(role) {
        return map[role];
    }, roles);

    roles.sort();
    roles = roles.join('-');
    return `${deal.id}-${paymentType}-${zipcode}--${roles}`;
};

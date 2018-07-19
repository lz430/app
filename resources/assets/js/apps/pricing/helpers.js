import R from 'ramda';

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
    const map = {
        default: 'd',
        employee: 'e',
        supplier: 's',
        college: 'col',
        military: 'mil',
        conquest: 'con',
        loyal: 'loy',
        responder: 'resp',
        gmcompetitive: 'gmcomp',
        gmlease: 'gmlease',
    };

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

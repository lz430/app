import PropTypes from 'prop-types';
import Dinero from '../node_modules/dinero.js/build/cjs/dinero';

const { shape, number, string, bool, arrayOf, object } = PropTypes;

export const dealType = shape({
    id: number.isRequired,
    is_active: bool,
    is_in_range: bool,
    status: string,
    year: string.isRequired,
    make: string.isRequired,
    model: string.isRequired,
    photos: arrayOf(
        shape({
            id: number.isRequired,
            url: string.isRequired,
            created_at: string,
            updated_at: string,
        })
    ),

    thumbnail: shape({
        id: number.isRequired,
        url: string.isRequired,
        created_at: string,
        updated_at: string,
    }),
});

export const modelYearType = shape({
    year: string.isRequired,
    make: string.isRequired,
    model: string.isRequired,
    thumbnail: string,
    deals: number.isRequired,
    payments: shape({
        cash: shape({
            payment: number.isRequired,
            down: number.isRequired,
            term: number.isRequired,
            rebates: number.isRequired,
            rate: number.isRequired,
        }),
        finance: shape({
            payment: number.isRequired,
            down: number.isRequired,
            term: number.isRequired,
            rebates: number.isRequired,
            rate: number.isRequired,
        }),
        lease: shape({
            payment: number.isRequired,
            down: number.isRequired,
            term: number.isRequired,
            rebates: number.isRequired,
            rate: number.isRequired,
        }),
    }),
});

export const filterItemType = shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: number.isRequired,
    icon: string,
});

/**
 * @deprecated
 */
export const dealPricingType = shape({
    // TODO: Maybe be more specific here?
    data: object,
});

export const pricingType = shape({
    // TODO: Maybe be more specific here?
    data: object,
});

export const moneyValueType = PropTypes.oneOfType([
    PropTypes.instanceOf(Dinero),
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
]);

export const nextRouterType = shape({
    asPath: string.isRequired,
    pathname: string.isRequired,
    route: string.isRequired,
    query: object,
    back: PropTypes.func.isRequired,
    beforePopState: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
});

export const checkoutType = shape({
    deal: object,
});

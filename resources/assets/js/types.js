import PropTypes from 'prop-types';

const { shape, number, string, array, arrayOf, object } = PropTypes;

export const dealType = shape({
    id: number.isRequired,
    vin: string.isRequired,
    year: string.isRequired,
    msrp: number.isRequired,
    employee_price: number.isRequired,
    supplier_price: number.isRequired,
    make: string.isRequired,
    model: string.isRequired,
    dmr_features: array,
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

export const dealPricingType = shape({
    // TODO: Maybe be more specific here?
    data: object,
});

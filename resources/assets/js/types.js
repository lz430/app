import PropTypes from 'prop-types';

const { shape, number, string, arrayOf, object } = PropTypes;

export const dealType = shape({
    id: number.isRequired,
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

export const filterItemType = shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: number.isRequired,
    icon: string,
});

export const dealPricingType = shape({
    // TODO: Maybe be more specific here?
    data: object,
});

import React from 'react'
import PropTypes from 'prop-types';
import Deal from './Deal'

const Deals = ({deals}) => {
    return <div className="deals">
        {deals.data.map((deal, index) => {
            return <Deal deal={deal} key={index}></Deal>
        })}
    </div>
};

Deals.propTypes = {
    deals: PropTypes.shape({
        year: PropTypes.string.required,
        msrp: PropTypes.number.required,
        make: PropTypes.string.required,
        model: PropTypes.string.required,
        id: PropTypes.string.required
    })
};


export default Deals;

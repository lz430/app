import React from 'react'
import PropTypes from 'prop-types';
import Deal from './Deal'

const Deals = ({deals, fallbackDealImage},) => {
    return <div className="deals">
        {deals.map((deal, index) => {
            return <Deal
                deal={deal}
                key={index}
                fallbackDealImage={fallbackDealImage}
            />
        })}
    </div>
};

Deals.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.string.required,
            msrp: PropTypes.number.required,
            make: PropTypes.string.required,
            model: PropTypes.string.required,
            id: PropTypes.string.required,
        })
    ),
    fallbackDealImage: PropTypes.string
};

export default Deals;

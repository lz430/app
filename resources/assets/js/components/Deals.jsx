import React from 'react';
import PropTypes from 'prop-types';
import Deal from './Deal';

const Deals = ({ deals, fallbackDealImage }) => {
    return (
        <div className="deals">
                {deals.map((deal, index) => {
                    return (
                        <Deal
                            deal={deal}
                            key={index}
                            fallbackDealImage={fallbackDealImage}
                        />
                    );
                })}
            </div>
    );
};

Deals.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        })
    ),
    fallbackDealImage: PropTypes.string.isRequired,
};

export default Deals;

import React from 'react';
import PropTypes from 'prop-types';
import Deal from 'components/Deal';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Deals extends React.Component {
    render() {
        return (
            <div className="deals">
                {this.props.deals.map((deal, index) => {
                    return <Deal deal={deal} key={index} />;
                })}
                {this.props.dealPage === this.props.dealPageTotal
                    ? ''
                    : <div className="deals__show-more">
                          <button
                              onClick={this.props.requestMoreDeals}
                              className="deals__button deals__button--blue"
                          >
                              Show More
                          </button>
                      </div>}
            </div>
        );
    }
}

Deals.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        })
    ),
    dealPage: PropTypes.number.isRequired,
    dealPageTotal: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        dealPage: state.dealPage,
        dealPageTotal: state.dealPageTotal,
    };
}

export default connect(mapStateToProps, Actions)(Deals);

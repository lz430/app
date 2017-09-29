import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import Deal from 'components/Deal';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class Deals extends React.PureComponent {
    compareButtonClass(deal) {
        return (
            'deal__button deal__button--small ' +
            (R.contains(deal, R.map(R.prop('deal'), this.props.compareList))
                ? 'deal__button--blue'
                : '')
        );
    }

    renderShowMoreButton() {
        if (this.props.deals && this.props.requestingMoreDeals) {
            // Deals are already loaded and we have already requested more deals
            return <SVGInline svg={miscicons['loading']} />;
        }

        if (
            this.props.deals &&
            this.props.dealPage !== this.props.dealPageTotal
        ) {
            // Deals are already loaded, and there are more pages.
            return (
                <div className="deals__show-more">
                    <button
                        onClick={this.props.requestMoreDeals}
                        className="deals__button deals__button--blue"
                    >
                        Show More
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="deals">
                <div className="deals__title">Dealer Inventory</div>

                {this.props.deals ? (
                    this.props.deals.map((deal, index) => {
                        return (
                            <Deal deal={deal} key={index}>
                                <div className="deal__buttons">
                                    <button
                                        className={this.compareButtonClass(
                                            deal
                                        )}
                                        onClick={this.props.toggleCompare.bind(
                                            null,
                                            deal
                                        )}
                                    >
                                        Compare
                                    </button>
                                    <button
                                        onClick={() =>
                                            (window.location = `/deals/${deal.id}`)}
                                        className="deal__button deal__button--small deal__button--blue deal__button"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Deal>
                        );
                    })
                ) : (
                    <SVGInline svg={miscicons['loading']} />
                )}
                {this.renderShowMoreButton()}
            </div>
        );
    }
}

Deals.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            employee_price: PropTypes.number.isRequired,
            supplier_price: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        })
    ),
    dealPage: PropTypes.number,
    dealPageTotal: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        dealPage: state.dealPage,
        dealPageTotal: state.dealPageTotal,
        compareList: state.compareList,
        requestingMoreDeals: state.requestingMoreDeals,
    };
}

export default connect(mapStateToProps, Actions)(Deals);

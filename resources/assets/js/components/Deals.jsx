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
            'deal__button deal__button--small deal__button--blue' +
            (R.contains(deal, R.map(R.prop('deal'), this.props.compareList))
                ? 'deal__button--blue'
                : '')
        );
    }

    renderShowMoreButton() {
        if (this.props.deals && this.props.requestingMoreDeals) {
            // Deals are already loaded and we have already requested more deals
            return <SVGInline svg={miscicons['loading']}/>;
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
        if (this.props.deals && this.props.deals.length) {
            return (
                <div>
                    <div className={`deals ${this.props.compareList.length > 0 ? '' : 'no-compare'}`}>
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
                                                Add to Compare
                                            </button>
                                            <button
                                                onClick={() =>
                                                    (window.location = `/deals/${deal.id}`)}
                                                className="deal__button deal__button--small deal__button--pink deal__button"
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
                </div>
            )
        }

        else {
            return (
                <div className="deals__no-matches">
                    <div>
                        <p>Our service is not currently available in your area. Please provide your email so that we can notify you when we arrive. We apologize for the inconvenience.</p>
                    </div>
                    <div>
                        <input className="deals__input" placeholder="Enter your email address" />
                        <button className="deals__button deals__button--blue"
                            // onClick={() =>(do something)}
                        >Submit Email</button>
                    </div>
                </div>
            )

        }
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
        zipInRange: state.zipInRange,
    };
}

export default connect(mapStateToProps, Actions)(Deals);

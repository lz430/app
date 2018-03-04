import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import * as Actions from 'actions';
import Deal from './Deal';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class ViewDeals extends React.PureComponent {
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
        return (
            <div>
                <button className="deal__button deal__button--small deal__button--pink deal__button"
                    onClick={() => { this.props.clearModelYear() }}>
                    BACK
                </button>
                <div className={'deals ' + (this.props.compareList.length > 0 ? '' : 'no-compare')}>
                    {this.props.deals && this.props.deals.length ? (
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
                        <SVGInline svg={miscicons['loading']}/>
                    )}

                    {this.renderShowMoreButton()}
                </div>
            </div>
        )
    }
}

ViewDeals.propTypes = {
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
    dealsByMakeModelYear: PropTypes.array,
    dealPage: PropTypes.number,
    dealPageTotal: PropTypes.number,
    selectedDealGrouping: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        dealsByMakeModelYear: state.dealsByMakeModelYear,
        dealPage: state.dealPage,
        dealPageTotal: state.dealPageTotal,
        compareList: state.compareList,
        selectedDealGrouping: state.selectedDealGrouping,
        requestingMoreDeals: state.requestingMoreDeals
    };
}

export default connect(mapStateToProps, Actions)(ViewDeals);

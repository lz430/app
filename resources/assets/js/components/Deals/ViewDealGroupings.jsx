import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import * as Actions from 'actions';
import Deal from './Deal';
import DealGrouping from './DealGrouping';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class ViewDealGroupings extends React.PureComponent {
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

    groupByModel(deals) {
        return R.values(
            R.mapObjIndexed(
                (index, key, value) => {
                    return {
                        make: value[key][0].make,
                        model: value[key][0].model,
                        year: value[key][0].year,
                        deals: value[key]
                    };
                },
                R.groupBy(deal => {
                    return `${deal.year} ${deal.make} ${deal.model}`;
                }, deals)
            )
        );
    }
    
    renderModels() {
        let modelsWithDeals = this.groupByModel(this.props.deals);

        return (
            <div>
                <div className={'deals ' + (this.props.compareList.length > 0 ? '' : 'no-compare')}>
                    {modelsWithDeals ? (
                        modelsWithDeals.map((model, index) => {
                            return <DealGrouping dealGrouping={model} key={index} />
                        })
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
    
    renderDeals() {
        return (
            <div>
                <div className={'deals ' + (this.props.compareList.length > 0 ? '' : 'no-compare')}>
                    {this.props.deals ? (
                        this.props.deals.map((deal, index) => {
                            return (
                                <Deal deal={deal} key={deal.id}>
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

    render() {
        return this.renderModels();
    }
}

ViewDealGroupings.propTypes = {
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
        requestingMoreDeals: state.requestingMoreDeals
    };
}

export default connect(mapStateToProps, Actions)(ViewDealGroupings);

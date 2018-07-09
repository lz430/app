import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import Deal from '../../../components/Deals/Deal';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

import { toggleCompare } from 'apps/common/actions';
import { requestMoreDeals } from '../actions';

class ViewDeals extends React.PureComponent {
    static propTypes = {
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
        compareList: PropTypes.array,
        dealsByMakeModelYear: PropTypes.array,
        meta: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool,
        onRequestMoreDeals: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
    };

    compareButtonClass(deal) {
        return (
            'deal__button deal__button--x-small deal__button--blue' +
            (R.contains(deal, R.map(R.prop('deal'), this.props.compareList))
                ? 'deal__button--blue'
                : '')
        );
    }

    renderShowMoreButton() {
        if (this.props.deals && this.props.loadingSearchResults) {
            // Deals are already loaded and we have already requested more deals
            return <SVGInline svg={miscicons['loading']} />;
        }

        if (
            this.props.deals &&
            this.props.meta &&
            this.props.meta.current_page !== this.props.meta.last_page
        ) {
            // Deals are already loaded, and there are more pages.
            return (
                <div className="deals__show-more">
                    <button
                        onClick={this.props.onRequestMoreDeals}
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
                <div
                    className={
                        'deals ' +
                        (this.props.compareList.length > 0 ? '' : 'no-compare')
                    }
                >
                    {this.props.deals && this.props.deals.length ? (
                        this.props.deals.map((deal, index) => {
                            return (
                                <Deal deal={deal} key={index}>
                                    <div className="deal__buttons">
                                        <button
                                            className={this.compareButtonClass(
                                                deal
                                            )}
                                            onClick={this.props.onToggleCompare.bind(
                                                null,
                                                deal
                                            )}
                                        >
                                            Add to Compare
                                        </button>
                                        <a
                                            className="deal__button deal__button--x-small deal__button--pink deal__button"
                                            href={`/deals/${deal.id}`}
                                        >
                                            View Details
                                        </a>
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
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.common.compareList,
        meta: state.pages.dealList.meta,
        loadingSearchResults: state.pages.dealList.loadingSearchResults,
        deals: state.pages.dealList.deals,
        dealsByMakeModelYear: state.pages.dealList.dealsByMakeModelYear,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestMoreDeals: () => {
            return dispatch(requestMoreDeals());
        },
        onToggleCompare: data => {
            return dispatch(toggleCompare(data));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewDeals);

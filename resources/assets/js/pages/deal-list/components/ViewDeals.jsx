import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import { dealType } from 'types';
import Loading from 'icons/miscicons/Loading';

import Deal from 'components/Deals/Deal';

import { toggleCompare } from 'apps/common/actions';
import { requestMoreDeals } from '../actions';

class ViewDeals extends React.PureComponent {
    static propTypes = {
        deals: PropTypes.arrayOf(dealType),
        compareList: PropTypes.array,
        dealsByMakeModelYear: PropTypes.array,
        meta: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool,
        onRequestMoreDeals: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
    };

    compareListContainsDeal(deal) {
        return R.contains(deal, R.map(R.prop('deal'), this.props.compareList));
    }

    compareButtonClass(deal) {
        return (
            'btn ' +
            (this.compareListContainsDeal(deal)
                ? 'btn-outline-primary'
                : 'btn-primary')
        );
    }

    renderShowMoreButton() {
        if (this.props.deals && this.props.loadingSearchResults) {
            // Deals are already loaded and we have already requested more deals
            return <Loading />;
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
                        className="btn btn-primary"
                    >
                        Show More
                    </button>
                </div>
            );
        }
    }

    renderDeal(deal, index) {
        return (
            <Deal deal={deal} key={index}>
                <div className="deal__buttons">
                    <button
                        className={this.compareButtonClass(deal)}
                        onClick={this.props.onToggleCompare.bind(null, deal)}
                    >
                        {this.compareListContainsDeal(deal)
                            ? 'Remove'
                            : 'Compare'}{' '}
                    </button>
                    <a className="btn btn-success" href={`/deals/${deal.id}`}>
                        View Details
                    </a>
                </div>
            </Deal>
        );
    }

    render() {
        return (
            <div className="deals-wrapper">
                <div className="inventory-summary-deck">
                    <div className="card-deck  m-0">
                        {this.props.deals && this.props.deals.length ? (
                            this.props.deals.map((deal, index) => {
                                return this.renderDeal(deal, index);
                            })
                        ) : (
                            <Loading />
                        )}
                    </div>
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

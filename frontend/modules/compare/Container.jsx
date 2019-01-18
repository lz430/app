import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Deal from '../../components/Deals/Deal';

import { initPage } from './actions';
import ToolbarPrice from './components/ToolbarPrice';
import EquipmentCategory from './components/EquipmentCategory';
import ErrorNoDealsToCompare from './components/ErrorNoDealsToCompare';

import { getComparedDeals, getEquipmentCategories } from './selectors';
import { getIsPageLoading } from '../../apps/page/selectors';

import Loading from '../../components/Loading';
import { withRouter } from 'next/router';
import { getSearchQuery } from '../deal-list/selectors';
import { batchRequestDealQuotes } from '../../apps/pricing/actions';
import Link from 'next/link';

class ComparePageContainer extends React.PureComponent {
    static propTypes = {
        cols: PropTypes.array.isRequired,
        deals: PropTypes.array,
        compareList: PropTypes.array.isRequired,
        equipmentCategories: PropTypes.array.isRequired,
        isLoading: PropTypes.bool,
        searchQuery: PropTypes.object,
        onPageInit: PropTypes.func.isRequired,
        onBatchRequestDealQuotes: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onPageInit();
    }

    componentDidUpdate(prevProps) {
        if (this.props.compareList.length !== prevProps.compareList.length) {
            this.props.onPageInit();
        }
    }

    renderColDeal(col) {
        const deal = col.deal;

        return (
            <Deal deal={deal} key={deal.id}>
                <div className="deal__buttons">
                    <Link
                        href={`/deal-detail?id=${deal.id}`}
                        as={`/deals/${deal.id}`}
                    >
                        <a className="btn btn-outline-success btn-sm">View</a>
                    </Link>
                </div>
            </Deal>
        );
    }

    renderDeals(style) {
        return (
            <div className="compare-page-deals" style={style}>
                {this.props.cols.map(this.renderColDeal)}
            </div>
        );
    }

    renderDealsContainer() {
        return this.renderDeals();
    }

    renderPageLoadingIcon() {
        return <Loading />;
    }

    render() {
        if (!this.props.compareList || !this.props.compareList.length) {
            return <ErrorNoDealsToCompare />;
        }
        if (this.props.isLoading) {
            return this.renderPageLoadingIcon();
        }

        let style = {
            maxWidth: this.props.compareList.length * 310 + 'px',
        };
        return (
            <div className="compare-page">
                <ToolbarPrice
                    searchQuery={this.props.searchQuery}
                    deals={this.props.deals}
                    onBatchRequestDealQuotes={
                        this.props.onBatchRequestDealQuotes
                    }
                />
                <div className="compare-page__body-wrapper">
                    <div className="compare-page__body">
                        <div style={style}>
                            {this.renderDealsContainer()}
                            <div className="compare-page-features">
                                {this.props.equipmentCategories.map(
                                    (category, index) => {
                                        return (
                                            <EquipmentCategory
                                                key={index}
                                                cols={this.props.cols}
                                                category={category}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deals: getComparedDeals(state),
        cols: state.pages.compare.cols,
        equipmentCategories: getEquipmentCategories(state),
        compareList: state.common.compareList,
        isLoading: getIsPageLoading(state),
        searchQuery: getSearchQuery(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onPageInit: () => {
            return dispatch(initPage());
        },
        onBatchRequestDealQuotes: deals => {
            return dispatch(batchRequestDealQuotes(deals));
        },
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ComparePageContainer);

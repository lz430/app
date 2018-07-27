import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Sticky } from 'react-sticky';

import util from 'src/util';
import Deal from 'components/Deals/Deal';

import { initPage } from './actions';
import ToolbarPrice from './components/ToolbarPrice';
import EquipmentCategory from './components/EquipmentCategory';
import ErrorNoDealsToCompare from './components/ErrorNoDealsToCompare';

import { getEquipmentCategories } from './selectors';
import { getIsPageLoading } from 'apps/page/selectors';

import Loading from 'icons/miscicons/Loading';

class ComparePageContainer extends React.PureComponent {
    static propTypes = {
        cols: PropTypes.array.isRequired,
        compareList: PropTypes.array.isRequired,
        equipmentCategories: PropTypes.array.isRequired,
        onPageInit: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
    };

    componentDidMount() {
        this.props.onPageInit();
    }

    renderColDeal(col) {
        const deal = col.deal;

        return (
            <Deal deal={deal} key={deal.id}>
                <div className="deal__buttons">
                    <button
                        className="btn btn-success"
                        onClick={() => (window.location = `/deals/${deal.id}`)}
                    >
                        View Details
                    </button>
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
        if (util.windowIsLargerThanSmall(this.props.window.width)) {
            return this.renderDeals();
        } else {
            return <Sticky>{({ style }) => this.renderDeals(style)}</Sticky>;
        }
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
                <div className="compare-page__toolbars">
                    <ToolbarPrice />
                </div>

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

    selectDeal(deal) {
        this.props.selectDeal(deal);
    }
}

const mapStateToProps = state => {
    return {
        cols: state.pages.compare.cols,
        equipmentCategories: getEquipmentCategories(state),
        compareList: state.common.compareList,
        dealsIdsWithCustomizedQuotes: state.common.dealsIdsWithCustomizedQuotes,
        window: state.common.window,
        isLoading: getIsPageLoading(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onPageInit: () => {
            return dispatch(initPage());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComparePageContainer);

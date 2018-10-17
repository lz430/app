import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Deal from '../../components/Deals/Deal';

import { initPage } from './actions';
import ToolbarPrice from './components/ToolbarPrice';
import EquipmentCategory from './components/EquipmentCategory';
import ErrorNoDealsToCompare from './components/ErrorNoDealsToCompare';

import { getEquipmentCategories } from './selectors';
import { getIsPageLoading } from '../../apps/page/selectors';

import Loading from '../../icons/miscicons/Loading';
import { compose } from 'redux';
import withTracker from '../../components/withTracker';
import { withRouter } from 'next/router';

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
                    <button
                        className="btn btn-success"
                        onClick={() => (window.location = `/deals/${deal.id}`)}
                    >
                        View
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
                <ToolbarPrice />
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
        cols: state.pages.compare.cols,
        equipmentCategories: getEquipmentCategories(state),
        compareList: state.common.compareList,
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

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(ComparePageContainer);

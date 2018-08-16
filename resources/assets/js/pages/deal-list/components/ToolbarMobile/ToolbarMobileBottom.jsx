import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tuning from 'icons/zondicons/Tuning';
import CheveronLeft from 'icons/zondicons/CheveronLeft';
import CurrencyDollar from 'icons/zondicons/CurrencyDollar';
import CheveronUp from 'icons/zondicons/CheveronUp';

import {
    clearModelYear,
    requestSearch,
    toggleSearchSort,
    toggleSmallFiltersShown,
} from '../../actions';
import { getSearchQuery, getSelectedFiltersByCategory } from '../../selectors';

import SortWidget from './SortWidget';
import PaymentWidget from './PaymentWidget';
import ModelWidget from './ModelWidget';

import { getUserPurchaseStrategy } from 'apps/user/selectors';
import { setPurchaseStrategy } from 'apps/user/actions';
import Coupe from '../../../../icons/body-styles/Coupe';
import TravelCar from '../../../../icons/zondicons/TravelCar';

/**
 *
 */
class ToolbarMobileBottom extends React.Component {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,

        onToggleSmallFiltersShown: PropTypes.func.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchSort: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
    };

    state = {
        activeTab: null,
    };

    setActiveTab(tab) {
        if (this.state.activeTab === 'filter' && tab !== 'filter') {
            this.props.onToggleSmallFiltersShown();
        }

        if (this.state.activeTab === tab) {
            this.setState({ activeTab: null });
        } else {
            this.setState({ activeTab: tab });
        }

        if (tab === 'filter') {
            this.props.onToggleSmallFiltersShown();
        }
    }

    renderBackButton() {
        return (
            <div
                className={classNames('toolbar-item', {
                    active: this.state.activeTab === 'model',
                })}
                onClick={() => this.setActiveTab('model')}
            >
                <TravelCar
                    height="16px"
                    className="sortbar__filter-toggle-icon"
                />{' '}
                Model
            </div>
        );
    }

    renderTrayContent() {
        if (this.state.activeTab === 'sort') {
            return (
                <SortWidget
                    searchQuery={this.props.searchQuery}
                    onToggleSearchSort={this.props.onToggleSearchSort}
                />
            );
        }

        if (this.state.activeTab === 'payment') {
            return (
                <PaymentWidget
                    purchaseStrategy={this.props.purchaseStrategy}
                    onSetPurchaseStrategy={this.props.onSetPurchaseStrategy}
                    onRequestSearch={this.props.onRequestSearch}
                />
            );
        }

        if (this.state.activeTab === 'model') {
            return (
                <ModelWidget
                    selectedFiltersByCategory={
                        this.props.selectedFiltersByCategory
                    }
                    onClearModelYear={this.props.onClearModelYear}
                    setActiveTab={this.setActiveTab.bind(this)}
                />
            );
        }

        return false;
    }

    render() {
        return (
            <div className="toolbar-mobile-bottom">
                <div
                    className={classNames('tray', {
                        show: this.state.activeTab !== null,
                    })}
                >
                    {this.renderTrayContent()}
                </div>
                <div className="menu">
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'filter',
                        })}
                        onClick={() => this.setActiveTab('filter')}
                    >
                        <Tuning
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Filter
                    </div>
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'sort',
                        })}
                        onClick={() => this.setActiveTab('sort')}
                    >
                        <CheveronUp
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Sort
                    </div>
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'payment',
                        })}
                        onClick={() => this.setActiveTab('payment')}
                    >
                        <CurrencyDollar
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Payment
                    </div>
                    {this.props.searchQuery.entity === 'deal' &&
                        this.renderBackButton()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchQuery: getSearchQuery(state),
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        purchaseStrategy: getUserPurchaseStrategy(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
        onClearModelYear: () => {
            return dispatch(clearModelYear());
        },
        onToggleSearchSort: sort => {
            return dispatch(toggleSearchSort(sort));
        },
        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
        },
        onRequestSearch: () => {
            return dispatch(requestSearch());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarMobileBottom);

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tuning from '../../../../icons/zondicons/Tuning';
import CurrencyDollar from '../../../../icons/zondicons/CurrencyDollar';
import CheveronUp from '../../../../icons/zondicons/CheveronUp';

import SortWidget from './SortWidget';
import PaymentWidget from './PaymentWidget';
import ModelWidget from './ModelWidget';

import TravelCar from '../../../../icons/zondicons/TravelCar';
import FilterPanel from '../FilterPanel';

/**
 *
 */
class ToolbarMobileBottom extends React.Component {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        selectedMake: PropTypes.string,
        purchaseStrategy: PropTypes.string.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchSort: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
        filters: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    state = {
        activeTab: null,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = e => {
        if (this.node.contains(e.target)) {
            return;
        }

        if (this.state.activeTab) {
            this.setState({ activeTab: null });
        }
    };

    setActiveTab(tab) {
        if (this.state.activeTab === tab) {
            this.setState({ activeTab: null });
        } else {
            this.setState({ activeTab: tab });
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
                <div>Model</div>
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
                    selectedMake={this.props.selectedMake}
                    onClearModelYear={this.props.onClearModelYear}
                    setActiveTab={this.setActiveTab.bind(this)}
                />
            );
        }

        return false;
    }

    render() {
        return (
            <div
                className="toolbar-mobile-bottom"
                ref={node => (this.node = node)}
            >
                <div
                    className={classNames('tray', {
                        show:
                            this.state.activeTab !== null &&
                            this.state.activeTab !== 'filter',
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
                        <div>Filter</div>
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
                        <div>Sort</div>
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
                        <div>Payment</div>
                    </div>
                    {this.props.searchQuery.entity === 'deal' &&
                        this.renderBackButton()}
                </div>
                <FilterPanel
                    isMobile={true}
                    isOpen={this.state.activeTab === 'filter'}
                    onToggleOpen={this.setActiveTab.bind(this)}
                    filters={this.props.filters}
                    searchQuery={this.props.searchQuery}
                    selectedFiltersByCategory={
                        this.props.selectedFiltersByCategory
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                    onClearModelYear={this.props.onClearModelYear}
                    onRequestSearch={this.props.onRequestSearch}
                />
            </div>
        );
    }
}

export default ToolbarMobileBottom;

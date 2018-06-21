import React from 'react';
import CashCalculator from 'components/CashCalculator';
import FinanceCalculator from 'components/FinanceCalculator';
import LeaseCalculator from 'components/LeaseCalculator';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import DealPricing from 'src/DealPricing';
import R from 'ramda';
import { makeDealPricing } from '../selectors';

class CashFinanceLeaseCalculator extends React.PureComponent {
    renderSelectedTab() {
        switch (this.props.selectedTab) {
            case 'cash':
                return (
                    <CashCalculator
                        {...R.pick(['dealPricing'], this.props)}
                        {...R.pick(
                            [
                                'requestTargets',
                                'requestBestOffer',
                                'showAccuPricingModal',
                            ],
                            this.props
                        )}
                    />
                );
            case 'finance':
                return (
                    <FinanceCalculator
                        {...R.pick(['dealPricing'], this.props)}
                        {...R.pick(
                            [
                                'requestTargets',
                                'requestBestOffer',
                                'showAccuPricingModal',
                            ],
                            this.props
                        )}
                    />
                );
            case 'lease':
                return (
                    <LeaseCalculator
                        {...R.pick(['dealPricing', 'deal'], this.props)}
                        {...R.pick(
                            [
                                'requestTargets',
                                'requestBestOffer',
                                'showAccuPricingModal',
                            ],
                            this.props
                        )}
                    />
                );
        }
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }

    tabClassName(tabName) {
        return `tabs__tab ${
            tabName === this.props.selectedTab ? 'tabs__tab--selected' : ''
        }`;
    }

    render() {
        return (
            <div className="cash-finance-lease-calculator">
                <div className="tabs">
                    <div
                        onClick={() => this.handleTabChange('cash')}
                        className={this.tabClassName('cash')}
                    >
                        Cash
                    </div>
                    <div
                        onClick={() => this.handleTabChange('finance')}
                        className={this.tabClassName('finance')}
                    >
                        Finance
                    </div>
                    <div
                        onClick={() => this.handleTabChange('lease')}
                        className={this.tabClassName('lease')}
                    >
                        Lease
                    </div>
                </div>
                <div className="tabs__content">{this.renderSelectedTab()}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const getDealPricing = makeDealPricing();
    const mapStateToProps = (state, props) => {
        return {
            selectedTab: state.selectedTab,
            dealPricing: new DealPricing(getDealPricing(state, props)),
        };
    };
    return mapStateToProps;
}

export default connect(
    mapStateToProps,
    Actions
)(CashFinanceLeaseCalculator);

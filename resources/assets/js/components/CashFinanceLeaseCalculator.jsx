import React from 'react';
import util from 'src/util';
import CashCalculator from 'components/CashCalculator';
import FinanceCalculator from 'components/FinanceCalculator';
import LeaseCalculator from 'components/LeaseCalculator';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class CashFinanceLeaseCalculator extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            milesPerYear: 10000,
            leaseTerm: 12,
        };

        this.tabClassName = this.tabClassName.bind(this);
    }

    renderSelectedTab() {
        switch (this.props.selectedTab) {
            case 'cash':
                return <CashCalculator deal={this.props.selectedDeal} />;
            case 'finance':
                return <FinanceCalculator deal={this.props.selectedDeal} />;
            case 'lease':
                return <LeaseCalculator deal={this.props.selectedDeal} />;
        }
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
                        onClick={this.props.selectTab.bind(this, 'cash')}
                        className={this.tabClassName('cash')}
                    >
                        Cash
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(this, 'finance')}
                        className={this.tabClassName('finance')}
                    >
                        Finance
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(this, 'lease')}
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
    return {
        zipcode: state.zipcode,
        selectedTab: state.selectedTab,
        selectedDeal: state.selectedDeal,
        employeeBrand: state.employeeBrand,
    };
}

export default connect(mapStateToProps, Actions)(CashFinanceLeaseCalculator);

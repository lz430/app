import React from 'react';
import util from 'src/util';

class CashFinanceLease extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedTab: 'cash',
            milesPerYear: 10000,
            leaseTerm: 12,
        };

        this.tabClassName = this.tabClassName.bind(this);
    }

    selectTab(selectedTab) {
        this.setState({ selectedTab });
    }

    tabClassName(tabName) {
        return `tabs__tab ${tabName === this.state.selectedTab ? 'tabs__tab--selected' : ''}`;
    }

    renderLeaseForm() {
        return (
            <div className="tabs__content">
                <div className="tabs__content__item">
                    <label htmlFor="down-payment">Down Payment</label>
                    <input
                        className="lease__down-payment"
                        type="number"
                        name="down-payment"
                    />
                </div>
                <div className="tabs__content__item">
                    <label htmlFor="miles-year">Miles Per Year</label>
                    <div className="range-slider">
                        <input
                            name="miles-year"
                            type="range"
                            min="0"
                            max="100000"
                            step="5000"
                            defaultValue={this.state.milesPerYear}
                            onChange={el =>
                                this.setState({
                                    milesPerYear: el.target.value,
                                })}
                        />
                        <div className="range-slider__badge">
                            {util.numbersWithCommas(this.state.milesPerYear)}
                        </div>
                    </div>
                </div>
                <div className="tabs__content__item">
                    <label htmlFor="lease-term">Lease Term (Months)</label>
                    <div className="range-slider">
                        <input
                            name="lease-term"
                            type="range"
                            min="0"
                            max="72"
                            step="1"
                            defaultValue={this.state.leaseTerm}
                            onChange={el =>
                                this.setState({ leaseTerm: el.target.value })}
                        />
                        <div className="range-slider__badge">
                            {this.state.leaseTerm}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="tabs">
                    <div
                        onClick={this.selectTab.bind(this, 'cash')}
                        className={this.tabClassName('cash')}
                    >
                        Cash
                    </div>
                    <div
                        onClick={this.selectTab.bind(this, 'finance')}
                        className={this.tabClassName('finance')}
                    >
                        Finance
                    </div>
                    <div
                        onClick={this.selectTab.bind(this, 'lease')}
                        className={this.tabClassName('lease')}
                    >
                        Lease
                    </div>
                </div>
                {this.state.selectedTab === 'lease'
                    ? this.renderLeaseForm()
                    : ''}
            </div>
        );
    }
}

export default CashFinanceLease;

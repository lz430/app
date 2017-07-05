import React from 'react';

class CashFinanceLease extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedTab: 'cash',
        };

        this.tabClassName = this.tabClassName.bind(this);
    }

    selectTab(selectedTab) {
        this.setState({ selectedTab });
    }

    tabClassName(tabName) {
        return `title-bar__tab ${tabName === this.state.selectedTab ? 'title-bar__tab--selected' : ''}`;
    }

    render() {
        return (
            <div className="title-bar__tabs">
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
        );
    }
}

export default CashFinanceLease;

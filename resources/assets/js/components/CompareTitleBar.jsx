import React from 'react';

class CompareTitleBar extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedTab: 'cash',
        };
    }

    selectTab(selectedTab) {
        this.setState({ selectedTab });
    }

    buttonClass(tabName) {
        return `title-bar__button title-bar__button--small ${tabName === this.state.selectedTab ? 'title-bar__button--blue' : ''}`;
    }

    render() {
        return (
            <div className="title-bar">
                <div className="title-bar__title">

                    Vehicle Comparison
                </div>
                <div className="title-bar__buttons">
                    <button
                        onClick={this.selectTab.bind(this, 'cash')}
                        className={this.buttonClass('cash')}
                    >
                        Cash
                    </button>
                    <button
                        onClick={this.selectTab.bind(this, 'finance')}
                        className={this.buttonClass('finance')}
                    >
                        Finance
                    </button>
                    <button
                        onClick={this.selectTab.bind(this, 'lease')}
                        className={this.buttonClass('lease')}
                    >
                        Lease
                    </button>
                </div>
                <div className="title-bar__content">
                    {this.state.selectedTab}
                </div>
            </div>
        );
    }
}

export default CompareTitleBar;

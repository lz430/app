import React from 'react';
import { connect } from 'react-redux';

import util from 'src/util';
import * as Actions from 'apps/common/actions';
import CloseSolid from 'icons/zondicons/CloseSolid';
import ArrowRight from 'icons/zondicons/ArrowRight';
import TravelCar from 'icons/zondicons/TravelCar';

class CompareBar extends React.PureComponent {
    state = {
        count: this.props.compareList.length,
        shaking: true,
    };

    constructor(props) {
        super(props);

        window.setTimeout(() => {
            if (!this._isMounted) return;
            this.setState({
                shaking: false,
            });
        }, 1000);

        this.compareReady = this.compareReady.bind(this);
        this.compareButtonClass = this.compareButtonClass.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
        this.renderCompareBar = this.renderCompareBar.bind(this);
        this.renderCompareBubble = this.renderCompareBubble.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate() {
        if (this.state.count !== this.props.compareList.length) {
            if (!this._isMounted) return;
            this.setState({
                count: this.props.compareList.length,
                shaking: true,
            });

            window.setTimeout(() => {
                if (!this._isMounted) return;
                this.setState({
                    shaking: false,
                });
            }, 1000);
        }
    }

    redirectToCompare() {
        if (this.compareReady()) {
            window.location.href =
                '/compare?' +
                this.props.compareList
                    .map(
                        dealAndSelectedFilters =>
                            `deals[]=${dealAndSelectedFilters.deal.id}`
                    )
                    .join('&') +
                `&zipcode=${this.props.zipcode}`;
        }
    }

    compareReady() {
        return this.props.compareList.length >= 2;
    }

    compareButtonClass() {
        return `compare-bar__compare-button ${
            this.compareReady() ? '' : 'compare-bar__compare-button--not-ready'
        }`;
    }

    renderCompareBar() {
        return (
            <div
                className={`${
                    this.props.class ? this.props.class : 'compare-bar'
                }
                    ${this.state.count == 0 ? 'hidden' : ''}`}
            >
                <div className="compare-bar__deals">
                    {this.props.compareList.map(
                        (dealAndSelectedFilters, index) => {
                            const deal = dealAndSelectedFilters.deal;

                            return (
                                <div key={index} className="compare-bar__deal">
                                    <div className="compare-bar__deal__info">
                                        <div className="compare-bar__deal__info__year-and-make">
                                            {deal.year} {deal.make}
                                            {deal.model} {deal.series}
                                        </div>

                                        <div className="compare-bar__deal__info__color">
                                            {deal.color}, {deal.interior_color}
                                        </div>

                                        <div className="compare-bar__deal__info__msrp">
                                            {util.moneyFormat(deal.msrp)} MSRP
                                        </div>
                                    </div>
                                    <CloseSolid
                                        onClick={this.props.toggleCompare.bind(
                                            null,
                                            dealAndSelectedFilters.deal
                                        )}
                                        width="15px"
                                        height="15px"
                                        className="compare-bar__deal__remove"
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
                <div
                    onClick={this.redirectToCompare}
                    className={this.compareButtonClass()}
                >
                    <ArrowRight
                        width="15px"
                        height="15px"
                        className="compare-bar__compare-button__arrow"
                    />
                    <br />
                    COMPARE
                </div>
            </div>
        );
    }

    renderCompareBubble() {
        const className = `compare-bubble ${
            this.state.shaking ? 'compare-bubble--shake' : ''
        }`;

        return (
            <div>
                <div className={className} onClick={this.redirectToCompare}>
                    <TravelCar
                        width="20px"
                        height="20px"
                        className="compare-bubble__icon"
                    />
                    <div className="compare-bubble__count">
                        {this.props.compareList.length}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return util.windowIsLargerThanMedium(this.props.window.width)
            ? this.renderCompareBar()
            : null;
    }
}

function mapStateToProps(state) {
    return {
        employeeBrand: state.common.employeeBrand,
        window: state.common.window,
        compareList: state.common.compareList,
        zipcode: state.user.purchasePreferences.strategy,
    };
}

export default connect(
    mapStateToProps,
    Actions
)(CompareBar);

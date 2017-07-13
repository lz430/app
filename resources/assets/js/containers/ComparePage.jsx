import React from 'react';
import CashFinanceLease from 'components/CashFinanceLease';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';
import R from 'ramda';
import Modal from 'components/Modal';
import { raw as DealDetails } from 'components/DealDetails';

class ComparePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: props.deals,
            dealIndex: 0,
            selectedDeal: null,
        };
        this.renderIncentive = this.renderIncentive.bind(this);
        this.renderDeal = this.renderDeal.bind(this);
        this.getMarginLeft = this.getMarginLeft.bind(this);
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.dealClass = this.dealClass.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.intendedRoute = this.intendedRoute.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keyup', event => {
            const keyPressed = parseInt(event.keyCode, 10);

            switch (keyPressed) {
                case 37: // left arrow
                    this.slideLeft();
                    break;
                case 39: // right arrow
                    this.slideRight();
                    break;
                default:
                    break;
            }
        });

        // ********************************************************
        // ********************************************************
        // Detect swipe left and swipe right
        // Modified from https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        document.addEventListener(
            'touchstart',
            touchStartEvent => {
                let xDown = touchStartEvent.touches[0].clientX;
                let yDown = touchStartEvent.touches[0].clientY;

                document.addEventListener(
                    'touchmove',
                    toucheEndEvent => {
                        let deltaX = xDown - toucheEndEvent.touches[0].clientX;
                        let deltaY = yDown - toucheEndEvent.touches[0].clientY;

                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            /*most significant*/
                            if (deltaX > 0) {
                                this.slideLeft();
                            } else {
                                this.slideRight();
                            }
                        } else {
                            if (deltaY > 0) {
                                /* up swipe */
                            } else {
                                /* down swipe */
                            }
                        }

                        xDown = null;
                        yDown = null;
                    },
                    false
                );
            },
            false
        );
        // ********************************************************
        // ********************************************************
    }

    slideLeft() {
        this.setState({
            dealIndex: Math.min(
                this.state.dealIndex + 1,
                this.props.deals.length - 1
            ),
        });
    }

    slideRight() {
        this.setState({
            dealIndex: Math.max(this.state.dealIndex - 1, 0),
        });
    }

    removeDeal(deal) {
        this.setState({
            deals: R.without([deal], this.state.deals),
        });
    }

    renderIncentive(incentive, index) {
        return (
            <div key={index} className="compare-deal__incentive">
                {incentive.title}
                ${incentive.cash}
            </div>
        );
    }

    dealClass(index) {
        let className = 'compare-page-deals__deal';

        if (index < this.state.dealIndex || index > this.state.dealIndex + 2) {
            className += ' compare-page-deals__deal--opaque';
        }

        return className;
    }

    selectDeal(deal) {
        this.setState({ selectedDeal: deal });
    }

    closeModal() {
        this.setState({ selectedDeal: null });
    }

    intendedRoute() {
        return encodeURIComponent(
            `compare?${this.state.deals
                .map(deal => {
                    return `deals[]=${deal.id}`;
                })
                .join('&')}`
        );
    }

    renderSelectedDealModal() {
        return (
            <Modal
                onClose={this.closeModal}
                title={this.state.selectedDeal.model}
                subtitle={
                    this.state.selectedDeal.year +
                        ' ' +
                        this.state.selectedDeal.make
                }
            >
                {() => (
                    <DealDetails
                        deal={this.state.selectedDeal}
                        compareList={this.state.deals}
                        intendedRoute={this.intendedRoute()}
                        toggleCompare={() => {
                            this.removeDeal(this.state.selectedDeal);
                            this.closeModal();
                        }}
                    />
                )}
            </Modal>
        );
    }

    renderDeal(deal, index) {
        return (
            <div key={index} className={this.dealClass(index)}>
                <img className="compare-deal__image" src={deal.photos[0].url} />

                <div className="compare-deal__buttons">
                    <button
                        onClick={this.selectDeal.bind(this, deal)}
                        className="compare-deal__button compare-deal__button--small"
                    >
                        View Details
                    </button>
                    <a
                        onClick={this.removeDeal.bind(this, deal)}
                        className="compare-deal__button compare-deal__button--small"
                    >
                        Remove
                    </a>
                </div>
                <div className="compare-deal__basic-info">
                    <div className="compare-deal__basic-info__title">
                        {deal.year} {deal.make} {deal.model}
                    </div>

                    <div className="compare-deal__basic-info__content">
                        <div className="compare-deal__basic-info__subtitle">
                            DMR Price
                        </div>

                        <div className="compare-deal__basic-info__price">
                            {util.moneyFormat(deal.price)}
                        </div>
                    </div>
                </div>
                <div className="compare-deal__incentives">
                    <div className="compare-deal__incentive">
                        <input
                            className="compare-deal__incentive__checkbox"
                            type="checkbox"
                        />
                        <span className="compare-deal__incentive__name">
                            Armed forces or family of armed forces
                        </span>
                        <span className="compare-deal__incentive__value">
                            -$1,000
                        </span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input
                            className="compare-deal__incentive__checkbox"
                            type="checkbox"
                        />
                        <span className="compare-deal__incentive__name">
                            Other Incentive #1
                        </span>
                        <span className="compare-deal__incentive__value">
                            -$500
                        </span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input
                            className="compare-deal__incentive__checkbox"
                            type="checkbox"
                        />
                        <span className="compare-deal__incentive__name">
                            Other Incentive #2
                        </span>
                        <span className="compare-deal__incentive__value">
                            -$2,000
                        </span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input
                            className="compare-deal__incentive__checkbox"
                            type="checkbox"
                        />
                        <span className="compare-deal__incentive__name">
                            Other Incentive #3
                        </span>
                        <span className="compare-deal__incentive__value">
                            -$1,500
                        </span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input
                            className="compare-deal__incentive__checkbox"
                            type="checkbox"
                        />
                        <span className="compare-deal__incentive__name">
                            Other Incentive #4
                        </span>
                        <span className="compare-deal__incentive__value">
                            -$200
                        </span>
                    </div>
                    {/*{deal.versions[0].incentives.map(this.renderIncentive)}*/}
                </div>
                <div className="compare-deal__cta">
                    <div className="compare-deal__cta__info">
                        <div className="compare-deal__cta__title">
                            Your DMR Price
                        </div>
                        <div className="compare-deal__cta__price">
                            {util.moneyFormat(deal.price)}
                        </div>
                    </div>
                    <button className="compare-deal__cta__button compare-deal__cta__button--small compare-deal__cta__button--blue">
                        Buy Now
                    </button>
                </div>
            </div>
        );
    }

    getMarginLeft() {
        const dealPadding = 10;

        const clientWidth = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );

        const subtractWidth = clientWidth < 576 ? clientWidth : 300;

        return this.state.dealIndex * (-subtractWidth - dealPadding);
    }

    render() {
        return (
            <div className="compare-page">
                {this.state.selectedDeal ? this.renderSelectedDealModal() : ''}
                <div className="compare-page-title-bar__title">
                    Vehicle Comparison
                </div>
                <div className="compare-page__arrow-buttons">
                    <SVGInline
                        onClick={this.slideLeft}
                        width="40px"
                        className="compare-page__arrow-button"
                        svg={zondicons['cheveron-left']}
                    />
                    <SVGInline
                        onClick={this.slideRight}
                        width="40px"
                        className="compare-page__arrow-button"
                        svg={zondicons['cheveron-right']}
                    />
                </div>
                <CashFinanceLease />
                <div className="compare-page__swipe-notification">
                    <em>Swipe to left to compare other vehicles.</em>
                </div>
                <div
                    style={{ marginLeft: this.getMarginLeft() }}
                    className="compare-page-deals"
                >
                    {this.state.deals.map(this.renderDeal)}
                </div>
            </div>
        );
    }
}

export default ComparePage;

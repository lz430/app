import React from 'react';
import CashFinanceLease from 'components/CashFinanceLease';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';
import R from 'ramda';

class ComparePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: props.deals,
        };
        this.renderIncentive = this.renderIncentive.bind(this);
        this.renderDeal = this.renderDeal.bind(this);
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

    renderDeal(deal, index) {
        return (
            <div key={index} className="compare-deal">
                <img className="compare-deal__image" src={deal.photos[0].url} />

                <div className="compare-deal__buttons">
                    <button className="compare-deal__button compare-deal__button--small">
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
                    <p className="compare-deal__basic-info__title">
                        {deal.year} {deal.make} {deal.model}
                    </p>

                    DMR Price
                    {' '}
                    <span className="compare-deal__basic-info__price">
                        {util.moneyFormat(deal.price)}
                    </span>
                </div>
                <div className="compare-deal__incentives">
                    <div className="compare-deal__incentive">
                        <input className="compare-deal__incentive__checkbox" type="checkbox"/>
                        <span className="compare-deal__incentive__name">Armed forces or family of armed forces</span>
                        <span className="compare-deal__incentive__value">-$1,000</span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input className="compare-deal__incentive__checkbox" type="checkbox"/>
                        <span className="compare-deal__incentive__name">Other Incentive #1</span>
                        <span className="compare-deal__incentive__value">-$500</span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input className="compare-deal__incentive__checkbox" type="checkbox"/>
                        <span className="compare-deal__incentive__name">Other Incentive #2</span>
                        <span className="compare-deal__incentive__value">-$2,000</span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input className="compare-deal__incentive__checkbox" type="checkbox"/>
                        <span className="compare-deal__incentive__name">Other Incentive #3</span>
                        <span className="compare-deal__incentive__value">-$1,500</span>
                    </div>
                    <div className="compare-deal__incentive">
                        <input className="compare-deal__incentive__checkbox" type="checkbox"/>
                        <span className="compare-deal__incentive__name">Other Incentive #4</span>
                        <span className="compare-deal__incentive__value">-$200</span>
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
    render() {
        return (
            <div className="title-bar">
                <div className="title-bar__title">
                    Vehicle Comparison
                </div>
                <div className="arrow-buttons">
                    <SVGInline
                        width="40px"
                        className="arrow-button"
                        svg={zondicons['cheveron-left']}
                    />
                    <SVGInline
                        width="40px"
                        className="arrow-button"
                        svg={zondicons['cheveron-right']}
                    />
                </div>
                <CashFinanceLease />
                <div className="compare-deals">
                    {this.state.deals.map(this.renderDeal)}
                </div>
            </div>
        );
    }
}

export default ComparePage;

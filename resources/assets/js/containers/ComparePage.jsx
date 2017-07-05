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
                <div className="compare-deal__basic-info">
                    {deal.year} {deal.make}
                    <br />
                    {deal.series} {deal.model}
                    <br />
                    {deal.price}
                </div>
                <img className="compare-deal__image" src={deal.photos[0].url} />

                <div className="compare-deal__buttons">
                    <button className="compare-deal__button compare-deal__button--small compare-deal__button--blue compare-deal__button">
                        Buy Now
                    </button>
                    <a
                        onClick={this.removeDeal.bind(this, deal)}
                        className="compare-deal__button compare-deal__button--small compare-deal__button--blue compare-deal__button"
                    >
                        Remove
                    </a>
                </div>

                <div>
                    <p>MSRP: {util.moneyFormat(deal.msrp)}</p>
                    <p>DMR Price: {util.moneyFormat(deal.msrp)}</p>
                </div>

                <div className="compare-deal__incentives">
                    <div className="compare-deal__incentives--title">
                        Incentives
                    </div>
                    {deal.versions[0].incentives.map(this.renderIncentive)}
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
                        strokeWidth="12"
                        className="arrow-button"
                        svg={zondicons['cheveron-left']}
                    />
                    <SVGInline
                        width="40px"
                        strokeWidth="12"
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

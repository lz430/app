import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import purchase from 'src/purchase';
import R from 'ramda';
import qs from 'qs';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import Deal from 'components/Deal';
import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import rebates from 'src/rebates';

class ComparePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            deals: props.deals,
            dealIndex: 0,
            zipcode: R.prop(
                'zipcode',
                qs.parse(window.location.search.slice(1))
            ),
        };
        this.renderDeal = this.renderDeal.bind(this);
        this.intendedRoute = this.intendedRoute.bind(this);

        console.log(this.props.compareList);
    }

    removeDeal(deal) {
        this.setState({
            deals: R.without([deal], this.state.deals),
        });
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

    renderDeal(deal, index) {
        return (
            <Deal deal={deal} key={index}>
                <div className="deal__buttons">
                    <button
                        className={
                            'deal__button deal__button--small ' +
                            (R.contains(deal, this.props.compareList)
                                ? 'deal__button--blue'
                                : '')
                        }
                        onClick={() =>
                            purchase.start(
                                deal,
                                this.props.selectedTab,
                                this.props.downPayment,
                                rebates.getSelectedRebatesForDealAndType(
                                    this.props.dealRebates,
                                    this.props.selectedRebates,
                                    this.props.selectedTab,
                                    deal
                                ),
                                this.props.termDuration
                            )}
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={() => (window.location = `/deals/${deal.id}`)}
                        className="deal__button deal__button--small deal__button--blue deal__button"
                    >
                        Suggest Comparison
                    </button>
                </div>
            </Deal>
        );
    }

    renderDealRebatesModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }

    render() {
        return (
            <div className="compare-page">
                <a href="/filter">
                    <SVGInline width="10px" svg={zondicons['cheveron-left']} />
                    Back to Results
                </a>
                <div className="compare-page-title-bar__title">
                    Vehicle Comparison
                </div>
                <div className="compare-page-deals">
                    {this.state.deals.map(this.renderDeal)}
                </div>

                {this.props.selectedDeal ? this.renderDealRebatesModal() : ''}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedDeal: state.selectedDeal,
        selectedTab: state.selectedTab,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
    };
};

export default connect(mapStateToProps, Actions)(ComparePage);

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
import string from 'src/strings';

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
    }

    componentWillReceiveProps(props) {
        props.compareList.forEach(dealsAndSelectedFilters => {
            if (
                !props.dealRebates.hasOwnProperty(
                    dealsAndSelectedFilters.deal.id
                )
            )
                console.log('no rebates available'); //@todo pull rebates for the deal
        });
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
                        View Details
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

    renderSelectionsTable(compareList) {
        const maxNumberCells = R.reduce(
            (carry, dealAndSelectedFilters) => {
                return R.max(
                    R.propOr(
                        [],
                        'selectedFeatures',
                        dealAndSelectedFilters.selectedFilters
                    ).length,
                    carry
                );
            },
            0,
            compareList
        );

        return (
            <div className="compare-page-table">
                {compareList.map(({ deal, selectedFilters }, index) => {
                    return (
                        <div key={index} className="compare-page-table__column">
                            <div className="compare-page-table__cell">
                                {deal.id}&nbsp;
                            </div>
                            <div className="compare-page-table__cell">
                                {selectedFilters.selectedFuelType}&nbsp;
                            </div>
                            <div className="compare-page-table__cell">
                                {selectedFilters.selectedTransmissionType ? (
                                    string.toTitleCase(
                                        selectedFilters.selectedTransmissionType
                                    )
                                ) : (
                                    ''
                                )}&nbsp;
                            </div>
                            {selectedFilters.selectedFeatures.map(
                                (feature, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="compare-page-table__cell"
                                        >
                                            {feature}&nbsp;
                                        </div>
                                    );
                                }
                            )}
                            {R.range(
                                0,
                                maxNumberCells -
                                    selectedFilters.selectedFeatures.length
                            ).map((_, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="compare-page-table__cell"
                                    >
                                        &nbsp;
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    renderRebatesAndIncentivesTable(compareList) {
        const maxNumberCells = R.reduce(
            (carry, dealAndSelectedFilters) => {
                return R.max(
                    R.propOr(
                        [],
                        dealAndSelectedFilters.deal.id,
                        this.props.dealRebates
                    ).length,
                    carry
                );
            },
            0,
            compareList
        );

        return (
            <div className="compare-page-table">
                {compareList.map((dealAndSelectedFilters, index) => {
                    return (
                        <div key={index} className="compare-page-table__column">
                            {this.props.dealRebates[
                                dealAndSelectedFilters.deal.id
                            ].map((rebate, index) => {
                                return R.contains(
                                    this.props.selectedTab,
                                    rebate.types
                                ) ? (
                                    <div
                                        key={index}
                                        className="compare-page-table__cell"
                                    >
                                        {rebate.rebate}&nbsp;
                                    </div>
                                ) : (
                                    ''
                                );
                            })}
                            {R.range(
                                0,
                                maxNumberCells -
                                    this.props.dealRebates[
                                        dealAndSelectedFilters.deal.id
                                    ].length
                            ).map((_, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="compare-page-table__cell"
                                    >
                                        &nbsp;
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
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
                    Selected Vehicles to Compare…
                </div>
                <div className="compare-page__body">
                    <div className="compare-page-deals">
                        {this.state.deals.map(this.renderDeal)}
                    </div>
                    <div className="compare-page-table__header">
                        Your Selections
                    </div>
                    {this.props.compareList.length ? (
                        this.renderSelectionsTable(this.props.compareList)
                    ) : (
                        ''
                    )}
                    <div className="compare-page-table__header">
                        Rebates and Incentives
                    </div>
                    {this.props.compareList.length ? (
                        this.renderRebatesAndIncentivesTable(
                            this.props.compareList
                        )
                    ) : (
                        ''
                    )}
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

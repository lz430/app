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
import AccordionTable from 'components/AccordionTable';
import util from 'src/util';
import api from 'src/api';
import miscicons from 'miscicons';

class ComparePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dealIndex: 0,
            zipcode: R.prop(
                'zipcode',
                qs.parse(window.location.search.slice(1))
            ),
            openAccordion: 'Your Selections',
            dealWarranties: {},
        };
        this.renderDeal = this.renderDeal.bind(this);
        this.intendedRoute = this.intendedRoute.bind(this);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props) {
        props.compareList.map(dealAndSelectedFilters => {
            if (
                this.state.dealWarranties.hasOwnProperty(
                    dealAndSelectedFilters.deal.id
                )
            )
                return;

            api
                .getWarranties(
                    dealAndSelectedFilters.deal.versions[0].jato_vehicle_id
                )
                .then(data => {
                    let dealWarranties = this.state.dealWarranties;

                    dealWarranties[dealAndSelectedFilters.deal.id] = data.data;

                    this.setState({
                        dealWarranties,
                    });
                });
        });
    }

    toggleAccordion(openAccordion) {
        this.setState({
            openAccordion:
                this.state.openAccordion &&
                this.state.openAccordion === openAccordion
                    ? null
                    : openAccordion,
        });
    }

    intendedRoute() {
        return encodeURIComponent(
            `compare?${this.props.deals
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
                        className="deal__button deal__button--small deal__button--pink"
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
                                this.props.termDuration,
                                this.props.isEmployee
                            )}
                    >
                        Buy Now
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

    renderAccordionTabHeader(accordionTab) {
        return (
            <div
                onClick={() => this.toggleAccordion(accordionTab)}
                className={`compare-page-table__header ${this.state
                    .openAccordion === accordionTab
                    ? 'compare-page-table__header--open'
                    : ''}`}
            >
                <SVGInline
                    className="compare-page-table__header-cheveron"
                    svg={
                        this.state.openAccordion === accordionTab ? (
                            zondicons['cheveron-down']
                        ) : (
                            zondicons['cheveron-up']
                        )
                    }
                />
                {accordionTab}
            </div>
        );
    }

    columnClass(accordionTab) {
        return `compare-page-table__columns ${this.state.openAccordion !==
        accordionTab
            ? 'compare-page-table__columns--closed'
            : ''}`;
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

        const anyHaveFuelType = R.any(
            (selectedFilters) => { return selectedFilters.selectedFuelType; },
            compareList
        );

        const anyHaveTransmissionType = R.any(
            (selectedFilters) => { return selectedFilters.selectedTransmissionType; },
            compareList
        );

        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader('Your Selections')}
                <div className={this.columnClass('Your Selections')}>
                    {compareList.map(({ deal, selectedFilters }, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                            { anyHaveFuelType ?
                                <div className="compare-page-table__cell">
                                    {selectedFilters.selectedFuelType}&nbsp;
                                </div>
                                :
                                ''
                            }
                            { anyHaveTransmissionType ?
                                <div className="compare-page-table__cell">
                                    {selectedFilters.selectedTransmissionType ? (
                                        string.toTitleCase(
                                            selectedFilters.selectedTransmissionType
                                        )
                                    ) : (
                                        ''
                                    )}&nbsp;
                                </div>
                                :
                                ''
                            }
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
                {this.renderAccordionTabHeader('Rebates and Incentives')}
                <div className={this.columnClass('Rebates and Incentives')}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
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
            </div>
        );
    }

    renderPricingTable(compareList) {
        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader('Pricing')}
                <div className={this.columnClass('Pricing')}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                                <div className="compare-page-table__cell">
                                    <strong>MSRP:</strong>{' '}
                                    {util.moneyFormat(
                                        dealAndSelectedFilters.deal.msrp
                                    )}
                                </div>
                                <div className="compare-page-table__cell">
                                    <strong>Invoice:</strong>{' '}
                                    {util.moneyFormat(
                                        dealAndSelectedFilters.deal.versions[0]
                                            .invoice
                                    )}
                                </div>
                                <div className="compare-page-table__cell">
                                    <strong>Delivery:</strong> Always Free!
                                </div>
                                <div className="compare-page-table__cell">
                                    <strong>Deliver My Ride Price:</strong>{' '}
                                    {util.moneyFormat(
                                        util.getEmployeeOrSupplierPrice(
                                            dealAndSelectedFilters.deal,
                                            this.props.isEmployee
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderWarrantyTable(compareList) {
        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader('Warranty')}
                <div className={this.columnClass('Warranty')}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        const deal = dealAndSelectedFilters.deal;
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                                {this.state.dealWarranties.hasOwnProperty(
                                    deal.id
                                ) ? (
                                    this.state.dealWarranties[
                                        deal.id
                                    ].map((warranty, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="compare-page-table__cell"
                                            >
                                                {warranty.feature}:{' '}
                                                {warranty.content}
                                            </div>
                                        );
                                    })
                                ) : (
                                    'loading'
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderFeaturesTable(compareList) {
        const maxNumberCells = R.reduce(
            (carry, dealAndSelectedFilters) => {
                return R.max(
                    dealAndSelectedFilters.deal.features.length,
                    carry
                );
            },
            0,
            compareList
        );

        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader('Features')}
                <div className={this.columnClass('Features')}>
                    {compareList.map(({ deal }, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                                {deal.features.map((feature, index) => {
                                    return <div key={index} className="compare-page-table__cell">
                                        {feature.feature}&nbsp;
                                    </div>
                                })}
                                {R.range(
                                    0,
                                    maxNumberCells -
                                    deal.features.length
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
            </div>
        );
    }

    hasSelections(compareList) {
        const anyHaveFuelType = R.any(
            (selectedFilters) => { return selectedFilters.selectedFuelType; },
            this.props.compareList
        );

        const anyHaveTransmissionType = R.any(
            (selectedFilters) => { return selectedFilters.selectedTransmissionType; },
            this.props.compareList
        );

        return anyHaveFuelType || anyHaveTransmissionType;
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
                        {this.props.deals.map(this.renderDeal)}
                    </div>
                    {this.props.compareList && this.hasSelections(this.props.compareList) ? (
                        <AccordionTable>
                            {() => {
                                return this.renderSelectionsTable(
                                    this.props.compareList
                                );
                            }}
                        </AccordionTable>
                    ) : (
                        ''
                    )}
                    {R.all(
                        deal => this.props.dealRebates.hasOwnProperty(deal.id),
                        this.props.deals
                    ) ? (
                        <AccordionTable>
                            {() => {
                                return this.renderRebatesAndIncentivesTable(
                                    this.props.compareList
                                );
                            }}
                        </AccordionTable>
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}

                    <AccordionTable>
                        {() => {
                            return this.renderPricingTable(
                                this.props.compareList
                            );
                        }}
                    </AccordionTable>
                    <AccordionTable>
                        {() => {
                            return this.renderWarrantyTable(
                                this.props.compareList
                            );
                        }}
                    </AccordionTable>
                    {this.props.compareList.length ? (
                        <AccordionTable>
                            {() => {
                                return this.renderFeaturesTable(
                                    this.props.compareList
                                );
                            }}
                        </AccordionTable>
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
        deals: R.map(R.prop('deal'), state.compareList),
        compareList: state.compareList,
        selectedDeal: state.selectedDeal,
        selectedTab: state.selectedTab,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        isEmployee: state.isEmployee,
    };
};

export default connect(mapStateToProps, Actions)(ComparePage);

import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import purchase from 'src/purchase';
import R from 'ramda';
import qs from 'qs';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import Deal from 'components/Deals/Deal';
import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import string from 'src/strings';
import AccordionTable from 'components/AccordionTable';
import util from 'src/util';
import api from 'src/api';
import miscicons from 'miscicons';
import toTitleCase from 'titlecase';

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
                                /*
                                rebates.getSelectedTargetsForDeal(
                                    this.props.dealTargets,
                                    this.props.selectedTargets,
                                    deal
                                ),
                                */
                                [], // @TODO resolve somehow?
                                this.props.termDuration,
                                this.props.employeeBrand
                            )}
                    >
                        Buy Now
                    </button>
                </div>
            </Deal>
        );
    }

    renderCalculatorMOdal() {
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
            (dealAndSelectedFilters) => { return dealAndSelectedFilters.selectedFilters.selectedFuelType; },
            compareList
        );

        const anyHaveTransmissionType = R.any(
            (dealAndSelectedFilters) => { return dealAndSelectedFilters.selectedFilters.selectedTransmissionType; },
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

    renderTargetsTable(compareList) {
        const maxNumberCells = R.reduce(
            (carry, dealAndSelectedFilters) => {
                return R.max(
                    R.propOr(
                        [],
                        dealAndSelectedFilters.deal.id,
                        this.props.dealTargets
                    ).length,
                    carry
                );
            },
            0,
            compareList
        );

        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader('Something About Targets')}
                <div className={this.columnClass('Something About Targets')}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                            @TODO update this thing to be filtering by type correctly
                                {this.props.dealTargets[
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
                                        this.props.dealTargets[
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
                                            this.props.employeeBrand
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
        let featureSets = compareList.map(({ deal }, index) => {
            return deal.features;
        });

        let groupedFeatureSet = Object.values(R.groupBy(feature => {
            return feature.group;
        }, Object.values(R.mergeAll(featureSets))));

        return groupedFeatureSet.map((featureSet, index) => {
            return (
                <AccordionTable key={ index }>
                    {() => {
                        return (
                            <div className="compare-page-table">
                                {this.renderAccordionTabHeader(toTitleCase(featureSet[0].group) + ' Features')}
                                <div className={this.columnClass(toTitleCase(featureSet[0].group) + ' Features')}>
                                    {compareList.map(({ deal }, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="compare-page-table__column"
                                            >
                                                {featureSet.map((feature, index) => {
                                                    if ( deal.features.find(dealFeature => { return dealFeature.id == feature.id; })) {
                                                        return <div key={index} className="compare-page-table__cell">
                                                            {feature.feature}&nbsp;
                                                        </div>
                                                    } else {
                                                        return <div key={index} className="compare-page-table__cell">
                                                            &mdash;
                                                        </div>
                                                    }
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }}
                </AccordionTable>
            );
        });
    }

    hasSelections() {
        const anyHaveFuelType = R.any(
            (dealAndSelectedFilters) => { return dealAndSelectedFilters.selectedFilters.selectedFuelType; },
            this.props.compareList
        );

        const anyHaveTransmissionType = R.any(
            (dealAndSelectedFilters) => { return dealAndSelectedFilters.selectedFilters.selectedTransmissionType; },
            this.props.compareList
        );

        const anyHaveFeatures = R.any(
            (dealAndSelectedFilters) => { return dealAndSelectedFilters.selectedFilters.selectedFeatures && dealAndSelectedFilters.selectedFilters.selectedFeatures.length > 0; },
            this.props.compareList
        );

        return anyHaveFuelType || anyHaveTransmissionType || anyHaveFeatures;
    }

    render() {
        return (
            <div className="compare-page">
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

                        {/* <AccordionTable>
                            {() => {
                                return this.renderTargetsTable(
                                    this.props.compareList
                                );
                            }}
                        </AccordionTable> */}

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
                        this.renderFeaturesTable(
                            this.props.compareList
                        )
                    ) : (
                        ''
                    )}
                </div>

                {this.props.selectedDeal ? this.renderCalculatorMOdal() : ''}
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
        termDuration: state.termDuration,
        employeeBrand: state.employeeBrand,
    };
};

export default connect(mapStateToProps, Actions)(ComparePage);

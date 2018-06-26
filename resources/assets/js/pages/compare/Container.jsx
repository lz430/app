import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import R from 'ramda';
import qs from 'qs';
import { connect } from 'react-redux';
import * as Actions from 'apps/common/actions';
import Deal from 'components/Deals/Deal';
import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import string from 'src/strings';
import AccordionTable from './components/AccordionTable';
import util from 'src/util';
import api from 'src/api';
import ApiClient from 'store/api';
import toTitleCase from 'titlecase';
import AccuPricingModal from 'components/AccuPricingModal';
import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import { StickyContainer, Sticky } from 'react-sticky';

class Container extends React.PureComponent {
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
            featureCategories: {},
        };
        this.renderDeal = this.renderDeal.bind(this);
        this.intendedRoute = this.intendedRoute.bind(this);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        ApiClient.browse.getFeatureCategories().then(data => {
            this.setState({
                featureCategories: data.data.data,
            });
        });
    }

    componentWillReceiveProps(props) {
        props.compareList.map(dealAndSelectedFilters => {
            if (
                this.state.dealWarranties.hasOwnProperty(
                    dealAndSelectedFilters.deal.id
                )
            )
                return;

            api.getWarranties(
                dealAndSelectedFilters.deal.version.jato_vehicle_id
            )
                .then(data => {
                    let dealWarranties = this.state.dealWarranties;

                    dealWarranties[dealAndSelectedFilters.deal.id] = data.data;

                    this.setState({
                        dealWarranties,
                    });
                })
                .catch(e => {
                    let dealWarranties = this.state.dealWarranties;

                    dealWarranties[dealAndSelectedFilters.deal.id] = [];

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
                        className="deal__button deal__button--x-small deal__button--blue"
                        onClick={() => (window.location = `/deals/${deal.id}`)}
                    >
                        View Details
                    </button>
                    <CustomizeQuoteOrBuyNowButton
                        onCustomizeQuote={() => this.selectDeal(deal)}
                        deal={deal}
                        hasCustomizedQuote={R.contains(
                            deal.id,
                            this.props.dealsIdsWithCustomizedQuotes
                        )}
                    />
                </div>
            </Deal>
        );
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to compare"
                deal={this.props.selectedDeal}
            >
                <CashFinanceLeaseCalculator deal={this.props.selectedDeal} />
            </Modal>
        );
    }

    renderAccordionTabHeader(accordionTab) {
        return (
            <div
                onClick={() => this.toggleAccordion(accordionTab)}
                className={`compare-page-table__header ${
                    this.state.openAccordion === accordionTab
                        ? 'compare-page-table__header--open'
                        : ''
                }`}
            >
                <SVGInline
                    className="compare-page-table__header-cheveron"
                    svg={
                        this.state.openAccordion === accordionTab
                            ? zondicons['cheveron-down']
                            : zondicons['cheveron-up']
                    }
                />
                {accordionTab}
            </div>
        );
    }

    columnClass(accordionTab) {
        return `compare-page-table__columns ${
            this.state.openAccordion !== accordionTab
                ? 'compare-page-table__columns--closed'
                : ''
        }`;
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

        const anyHaveFuelType = R.any(dealAndSelectedFilters => {
            return dealAndSelectedFilters.selectedFilters.selectedFuelType;
        }, compareList);

        const anyHaveTransmissionType = R.any(dealAndSelectedFilters => {
            return dealAndSelectedFilters.selectedFilters
                .selectedTransmissionType;
        }, compareList);

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
                                {anyHaveFuelType ? (
                                    <div className="compare-page-table__cell">
                                        {selectedFilters.selectedFuelType}&nbsp;
                                    </div>
                                ) : (
                                    ''
                                )}
                                {anyHaveTransmissionType ? (
                                    <div className="compare-page-table__cell">
                                        {selectedFilters.selectedTransmissionType
                                            ? string.toTitleCase(
                                                  selectedFilters.selectedTransmissionType
                                              )
                                            : ''}&nbsp;
                                    </div>
                                ) : (
                                    ''
                                )}
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
                {this.renderAccordionTabHeader('Targets')}
                <div className={this.columnClass('Targets')}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                                @TODO update this thing to be filtering by type
                                correctly
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
                                )
                                    ? this.state.dealWarranties[deal.id].map(
                                          (warranty, index) => {
                                              return (
                                                  <div
                                                      key={index}
                                                      className="compare-page-table__cell"
                                                  >
                                                      {warranty.feature}:{' '}
                                                      {warranty.content}
                                                  </div>
                                              );
                                          }
                                      )
                                    : 'loading'}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    compareListDoesNotHavePickupCategory(compareList) {
        let allCategoryIds = [];
        const pickupCategory = this.state.featureCategories.find(category => {
            return category.attributes.slug === 'pickup';
        });

        compareList.map(({ deal }) => {
            deal.dmr_features.map(feature => {
                allCategoryIds.push(feature.category_id);
            });
        });

        return !R.contains(pickupCategory.id, allCategoryIds);
    }

    renderDMRFeaturesTable(compareList) {
        return this.state.featureCategories.map(featureCategory => {
            if (
                featureCategory.attributes.slug === 'pickup' &&
                this.compareListDoesNotHavePickupCategory(compareList)
            ) {
                return;
            }

            return (
                <AccordionTable key={featureCategory.id}>
                    {() => {
                        return (
                            <div className="compare-page-table">
                                {this.renderAccordionTabHeader(
                                    toTitleCase(
                                        featureCategory.attributes.title
                                    )
                                )}
                                <div
                                    className={this.columnClass(
                                        toTitleCase(
                                            featureCategory.attributes.title
                                        )
                                    )}
                                >
                                    {compareList.map(({ deal }, index) => {
                                        let features = deal.dmr_features.filter(
                                            dmr_feature => {
                                                return (
                                                    dmr_feature.category_id ==
                                                    featureCategory.id
                                                );
                                            }
                                        );

                                        return (
                                            <div
                                                className="compare-page-table__column"
                                                key={index}
                                            >
                                                {features.map(feature => {
                                                    return (
                                                        <div
                                                            className="compare-page-table__cell"
                                                            key={feature.slug}
                                                        >
                                                            {feature.title}
                                                        </div>
                                                    );
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

    renderFeaturesTable(compareList) {
        let featureSets = compareList.map(({ deal }, index) => {
            return deal.dmr_features
                .map(feature => {
                    let group = '';

                    if (this.state.featureCategories.length) {
                        group = this.state.featureCategories.find(category => {
                            return (
                                parseInt(category.id) ===
                                parseInt(feature.category_id)
                            );
                        });

                        if (group) {
                            group = group.attributes.slug.replace(/_/g, ' ');
                        } else {
                            group = '';
                        }
                    }

                    return {
                        id: feature.id,
                        feature: feature.title,
                        slug: feature.slug,
                        group: group,
                    };
                })
                .concat(deal.features);
        });

        let groupedFeatureSet = Object.values(
            R.groupBy(
                feature => {
                    return feature.group;
                },
                R.uniqBy(feature => {
                    console.log(feature);
                    return feature.group + '||' + feature.feature;
                }, Object.values(R.mergeAll(featureSets)))
            )
        );

        return groupedFeatureSet.map((featureSet, index) => {
            return (
                <AccordionTable key={index}>
                    {() => {
                        return (
                            <div className="compare-page-table">
                                {this.renderAccordionTabHeader(
                                    toTitleCase(featureSet[0].group) +
                                        ' Features'
                                )}
                                <div
                                    className={this.columnClass(
                                        toTitleCase(featureSet[0].group) +
                                            ' Features'
                                    )}
                                >
                                    {compareList.map(({ deal }, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="compare-page-table__column"
                                            >
                                                {featureSet.map(
                                                    (feature, index) => {
                                                        if (
                                                            deal.features.find(
                                                                dealFeature => {
                                                                    return (
                                                                        dealFeature.id ==
                                                                        feature.id
                                                                    );
                                                                }
                                                            ) ||
                                                            deal.dmr_features.find(
                                                                dealFeature => {
                                                                    return (
                                                                        dealFeature.id ==
                                                                        feature.id
                                                                    );
                                                                }
                                                            )
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="compare-page-table__cell"
                                                                >
                                                                    {
                                                                        feature.feature
                                                                    }
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="compare-page-table__cell"
                                                                >
                                                                    &mdash;
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                )}
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

    renderOptionalFeaturesTable(compareList) {
        const tabHeader = 'Optional Equipment On This Vehicle';
        const maxNumberCells = R.reduce(
            (carry, dealAndSelectedFilters) => {
                return R.max(
                    R.propOr([], 'vauto_features', dealAndSelectedFilters.deal)
                        .length,
                    carry
                );
            },
            0,
            compareList
        );

        return (
            <div className="compare-page-table">
                {this.renderAccordionTabHeader(tabHeader)}
                <div className={this.columnClass(tabHeader)}>
                    {compareList.map((dealAndSelectedFilters, index) => {
                        const alphabeticalFeatures = dealAndSelectedFilters.deal.vauto_features.sort();
                        return (
                            <div
                                key={index}
                                className="compare-page-table__column"
                            >
                                {alphabeticalFeatures.map((feature, index) => {
                                    return (
                                        <div
                                            className="compare-page-table__cell"
                                            key={index}
                                        >
                                            {feature}
                                        </div>
                                    );
                                })}
                                {R.range(
                                    0,
                                    maxNumberCells - alphabeticalFeatures.length
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

    hasSelections() {
        const anyHaveFuelType = R.any(dealAndSelectedFilters => {
            return dealAndSelectedFilters.selectedFilters.selectedFuelType;
        }, this.props.compareList);

        const anyHaveTransmissionType = R.any(dealAndSelectedFilters => {
            return dealAndSelectedFilters.selectedFilters
                .selectedTransmissionType;
        }, this.props.compareList);

        const anyHaveFeatures = R.any(dealAndSelectedFilters => {
            return (
                dealAndSelectedFilters.selectedFilters.selectedFeatures &&
                dealAndSelectedFilters.selectedFilters.selectedFeatures.length >
                    0
            );
        }, this.props.compareList);

        return anyHaveFuelType || anyHaveTransmissionType || anyHaveFeatures;
    }

    renderAccuPricingCta() {
        return (
            <div>
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a onClick={this.props.showAccuPricingModal}>
                        <img
                            src="/images/accupricing-logo.png"
                            className="accupricing-cta__logo"
                        />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }

    renderPurchaseStrategyButtons() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handleTabChange('cash');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'cash'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('finance');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'finance'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('lease');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'lease'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Lease
                </div>
            </div>
        );
    }

    renderDeals(style) {
        return (
            <div className="compare-page-deals" style={style}>
                {this.props.deals.map(this.renderDeal)}
            </div>
        );
    }

    renderDealsContainer() {
        if (util.windowIsLargerThanSmall(this.props.window.width)) {
            return this.renderDeals();
        } else {
            return <Sticky>{({ style }) => this.renderDeals(style)}</Sticky>;
        }
    }

    render() {
        return (
            <StickyContainer className="compare-page">
                <div className="compare-page__body">
                    <div className="compare-page__top-row">
                        <div className="compare-page__top-row__section compare-page__top-row__section--accuPricing">
                            {this.renderAccuPricingCta()}
                        </div>
                        <div className="compare-page__top-row__section compare-page__top-row__section--tabButtons">
                            {this.renderPurchaseStrategyButtons()}
                        </div>
                    </div>

                    {this.renderDealsContainer()}

                    {this.props.compareList &&
                    this.hasSelections(this.props.compareList) ? (
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
                    <AccordionTable>
                        {() => {
                            return this.renderWarrantyTable(
                                this.props.compareList
                            );
                        }}
                    </AccordionTable>

                    {this.props.compareList.length
                        ? this.renderFeaturesTable(this.props.compareList)
                        : ''}

                    <AccordionTable>
                        {() => {
                            return this.renderOptionalFeaturesTable(
                                this.props.compareList
                            );
                        }}
                    </AccordionTable>
                </div>

                {this.props.selectedDeal ? this.renderCalculatorModal() : ''}
                <AccuPricingModal />
            </StickyContainer>
        );
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }

    selectDeal(deal) {
        this.props.selectDeal(deal);
    }
}

const mapStateToProps = state => {
    return {
        deals: R.map(R.prop('deal'), state.common.compareList),
        compareList: state.common.compareList,
        selectedDeal: state.common.selectedDeal,
        selectedTab: state.user.purchasePreferences.strategy,
        termDuration: state.common.termDuration,
        employeeBrand: state.common.employeeBrand,
        dealsIdsWithCustomizedQuotes: state.common.dealsIdsWithCustomizedQuotes,
        window: state.common.window,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);

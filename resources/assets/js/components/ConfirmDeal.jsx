import api from 'src/api';
import miscicons from 'miscicons';
import React from 'react';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';
import PropTypes from 'prop-types';
import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import { makeDealBestOfferTotalValue } from 'selectors/index';
import formulas from 'src/formulas';

class ConfirmDeal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showStandardFeatures: false,
            showFeatures: false,
            warranties: null,
            dimensions: null,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.requestBestOffer(this.props.deal);

        api
            .getDimensions(this.props.deal.version.jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    dimensions: response.data,
                });
            });

        api
            .getWarranties(this.props.deal.version.jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    warranties: response.data,
                });
            });
    }

    displayFinalPrice() {
        switch (this.props.selectedTab) {
            case 'cash':
                return formulas.calculateTotalCash(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    ),
                    this.props.deal.doc_fee,
                    this.props.dealBestOfferTotalValue
                );
            case 'finance': {
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.employeeBrand
                        ) - this.props.dealBestOfferTotalValue,
                        this.props.downPayment,
                        this.props.termDuration
                    )
                );
            }
            case 'lease': {
                return formulas.calculateTotalLeaseMonthlyPayment(
                    formulas.calculateLeasedMonthlyPayments(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.employeeBrand
                        ) - this.props.dealBestOfferTotalValue,
                        0,
                        0,
                        this.props.termDuration,
                        R.or(this.props.residualPercent, 31)
                    )
                );
            }
        }
    }

    hideModals() {
        this.setState({
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    renderStandardFeaturesModal(deal) {
        return (
            <Modal
                nowrapper={true}
                onClose={() => {
                    this.hideModals();
                }}
            >
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Standard Features</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                    <div className="modal__body deal-details__modal-body">
                        <h3>Specifications</h3>
                        <hr />

                        <h4>Dimensions</h4>
                        <ul>
                            {this.state.dimensions ? (
                                this.state.dimensions.map(
                                    (dimension, index) => {
                                        return (
                                            <li key={index}>
                                                {dimension.feature}:{' '}
                                                {dimension.content}
                                            </li>
                                        );
                                    }
                                )
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h4>Warranties</h4>
                        <ul>
                            {this.state.warranties ? (
                                this.state.warranties.map(
                                    (dimension, index) => {
                                        return (
                                            <li key={index}>
                                                {dimension.feature}:{' '}
                                                {dimension.content}
                                            </li>
                                        );
                                    }
                                )
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h3>Features</h3>
                        <hr />

                        <ul>
                            {deal.features.map((feature, index) => {
                                return <li key={index}>{feature.feature}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }

    renderFeaturesModal() {
        return (
            <Modal
                nowrapper={true}
                onClose={() => {
                    this.hideModals();
                }}
            >
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Additional Options</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(this.props.deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(this.props.deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                    <div className="modal__body deal-details__modal-body">
                        <ul>
                            {this.props.deal.vauto_features.map(
                                (feature, index) => {
                                    return <li key={index}>{feature}</li>;
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }

    showStandardFeatures() {
        this.setState({
            showStandardFeatures: true,
        });
    }

    showFeatures() {
        this.setState({
            showFeatures: true,
        });
    }

    renderAppliedRebatesLink() {
        if (!this.props.dealBestOfferTotalValue) {
            return <SVGInline svg={miscicons['loading']} />;
        }

        return (
            <div>
                <div className="confirm-deal__rebate-info confirm-deal__costs confirm-deal__bold">
                    <div>{`Rebates Applied:`}</div>
                    <div>{`${util.moneyFormat(
                        this.props.dealBestOfferTotalValue
                    )}`}</div>
                </div>

                <div className="confirm-deal__more-rebates confirm-deal__costs">
                    <div>
                        <a
                            onClick={() =>
                                this.props.selectDeal(this.props.deal)
                            }
                            href="#"
                        >
                            Get Rebates
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const deal = this.props.deal;

        return (
            <div>
                <div className="confirm-deal">
                    {this.props.hideImageAndTitle ? (
                        ''
                    ) : (
                        <div>
                            <div className="confirm-deal__basic-info">
                                <div className="confirm-deal__basic-info-year-and-model">
                                    <div className="confirm-deal__basic-info-year-and-make">
                                        {`${deal.year} ${deal.make}`}
                                    </div>

                                    <div className="confirm-deal__basic-info-model-and-series">
                                        {`${deal.model} ${deal.series}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="tabs__title">You Selected...</div>

                    <div className="confirm-deal__vehicle-info">
                        <div className="model-vin">
                            <p>
                                {`${deal.year} ${deal.make} ${deal.model} ${
                                    deal.series
                                }`}{' '}
                                <br />
                                {`Stock #${deal.vin}`}
                            </p>
                        </div>
                    </div>

                    <div className="confirm-deal__feature-buttons">
                        <button
                            onClick={() => this.showStandardFeatures(deal)}
                            className="confirm-deal__button confirm-deal__button--spacing confirm-deal__button--white confirm-deal__button--small"
                        >
                            <SVGInline svg={miscicons['binoculars']} />
                            Review Standard Features
                        </button>

                        <button
                            onClick={() => this.showFeatures(deal)}
                            className="confirm-deal__button confirm-deal__button--spacing confirm-deal__button--white confirm-deal__button--small"
                        >
                            <SVGInline svg={miscicons['binoculars']} />
                            Review Additional Options
                        </button>
                    </div>

                    <div className="confirm-deal__price">
                        <p className="confirm-deal__pricing-details">
                            Pricing Details
                        </p>
                        <p>{`${strings.toTitleCase(
                            this.props.selectedTab
                        )} Terms`}</p>

                        <div className="confirm-deal__prices">
                            <div className="confirm-deal__costs">
                                <div className="confirm-deal__label">
                                    Suggested Retail:{' '}
                                </div>
                                <div className="confirm-deal__amount">
                                    {util.moneyFormat(this.props.deal.msrp)}
                                </div>
                            </div>
                            <div className="confirm-deal__costs">
                                <div className="confirm-deal__label">
                                    Your Price:
                                </div>
                                <div className="confirm-deal__amount">{`${util.moneyFormat(
                                    this.props.deal.supplier_price
                                )}*`}</div>
                            </div>
                            {this.renderAppliedRebatesLink()}
                        </div>

                        <hr />
                        <div className="confirm-deal__final-price confirm-deal__costs confirm-deal__bold">
                            <div>{`Your ${strings.toTitleCase(
                                this.props.selectedTab
                            )}  Price:`}</div>
                            <div>
                                {`${util.moneyFormat(this.displayFinalPrice())}
                                ${
                                    this.props.selectedTab === 'finance' ||
                                    this.props.selectedTab === 'lease'
                                        ? ` /month`
                                        : ``
                                }`}
                            </div>
                        </div>
                        <p className="confirm-deal__disclaimer">
                            *Includes sales tax and dealer fees. License plate
                            fees not included.
                        </p>
                    </div>

                    {this.props.children}
                </div>
                {this.state.showStandardFeatures
                    ? this.renderStandardFeaturesModal(deal)
                    : ''}
                {this.state.showFeatures ? this.renderFeaturesModal(deal) : ''}
            </div>
        );
    }
}

ConfirmDeal.propTypes = {
    deal: PropTypes.shape({
        year: PropTypes.string.isRequired,
        msrp: PropTypes.number.isRequired,
        employee_price: PropTypes.number.isRequired,
        supplier_price: PropTypes.number.isRequired,
        make: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        vin: PropTypes.string.isRequired,
    }),
};

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const mapStateToProps = (state, props) => {
        return {
            compareList: state.compareList,
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            termDuration: state.termDuration,
            selectedDeal: state.selectedDeal,
            employeeBrand: state.employeeBrand,
            residualPercent: state.residualPercent,
            dealTargets: state.dealTargets,
            selectedTargets: state.selectedTargets,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(ConfirmDeal);

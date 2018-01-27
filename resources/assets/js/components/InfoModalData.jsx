import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import formulas from 'src/formulas';
import miscicons from 'miscicons';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import SVGInline from 'react-svg-inline';
import util from 'src/util';
import strings from 'src/strings';
import {
    makeDealBestOfferTotalValue,
    makeDealBestOffer,
} from 'selectors/index';

class InfoModalData extends React.PureComponent {
    componentDidMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
    }

    finalPrice() {
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
                return Math.round(
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

    handleGetRebatesLink() {
        this.props.selectDeal(this.props.deal);
        this.props.closeModal();
    }

    renderAppliedRebatesLink() {
        return (
            <div>
                <div className="info-modal-data__rebate-info info-modal-data__costs info-modal-data__bold">
                    <div className="info-modal-data__rebate-info__title">
                        Rebates Applied:
                    </div>
                    <div>
                        {util.moneyFormat(this.props.dealBestOfferTotalValue)}
                    </div>
                </div>
                {this.props.dealBestOffer.programs.map((program, index) => {
                    return (
                        <div
                            className="info-modal-data__rebate-info info-modal-data__costs"
                            key={index}
                        >
                            <div className="info-modal-data__rebate-info__title">
                                {strings.toTitleCase(program.title)}
                            </div>
                            <div>{`${util.moneyFormat(program.value)}`}</div>
                        </div>
                    );
                })}

                <div className="info-modal-data__more-rebates info-modal-data__costs">
                    <div>
                        <a
                            onClick={this.handleGetRebatesLink.bind(this)}
                            href="#"
                        >
                            Get Rebates
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    renderPaymentDefaults() {
        const financeDownPaymentAmount = 0.1;
        const leaseDownPaymentAmount = 0.05;
        const defaultTermLength = '60 months';
        const defaultMileage = '10,000 miles';

        if (this.props.selectedTab === 'finance') {
            return (
                <div>
                    <div>
                        <p className="info-modal-data__default-label">Terms</p>
                        <select
                            className="info-modal-data__default-option"
                            disabled
                        >
                            <option>{this.props.termDuration} months</option>
                        </select>
                    </div>
                    <div>
                        <p className="info-modal-data__default-label">
                            Down Payment
                        </p>
                        <input
                            className="info-modal-data__input"
                            disabled
                            placeholder={util.moneyFormat(
                                this.props.downPayment
                            )}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="info-modal-data__defaults">
                        <p className="info-modal-data__default-label">Terms</p>
                        <select
                            className="info-modal-data__default-option"
                            disabled
                        >
                            <option>{defaultTermLength}</option>
                        </select>
                    </div>
                    <div>
                        <p className="info-modal-data__default-label">
                            Mileage
                        </p>
                        <select
                            className="info-modal-data__default-option"
                            disabled
                        >
                            <option>{defaultMileage}</option>
                        </select>
                    </div>
                    <div className="info-modal-data__defaults">
                        <p className="info-modal-data__default-label">
                            Cash Due
                        </p>
                        <input
                            className="info-modal-data__default-option info-modal-data__input"
                            disabled
                            placeholder={util.moneyFormat(
                                this.props.deal.supplier_price *
                                    leaseDownPaymentAmount
                            )}
                        />
                    </div>
                </div>
            );
        }
    }

    renderPricingDisclaimer() {
        if (this.selectedTab === 'finance') {
            return (
                <p className="info-modal-data__disclaimer">
                    ** Monthly payment is based on 4% simple interest and
                    assumes good to excellent credit rating.
                </p>
            );
        } else {
            return (
                <p className="info-modal-data__disclaimer">
                    ** Monthly Payment assumes good to excellent credit rating.
                </p>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="info-modal-data">
                    <div className="info-modal-data__price">
                        <p className="info-modal-data__pricing-details">
                            Pricing Details
                        </p>
                        <p>{`${strings.toTitleCase(
                            this.props.selectedTab
                        )} Terms`}</p>

                        <div className="info-modal-data__prices">
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    Suggested Retail:{' '}
                                </div>
                                <div className="info-modal-data__amount">
                                    {util.moneyFormat(this.props.deal.msrp)}
                                </div>
                            </div>
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    Your Price:
                                </div>
                                <div className="info-modal-data__amount">{`${util.moneyFormat(
                                    this.props.deal.supplier_price
                                )}*`}</div>
                            </div>

                            {this.props.selectedTab === 'cash'
                                ? ''
                                : this.renderPaymentDefaults()}

                            {this.props.dealBestOfferTotalValue
                                ? this.renderAppliedRebatesLink()
                                : 'Loading Applied Rebates...'}
                        </div>

                        <hr />
                        <div className="info-modal-data__final-price info-modal-data__costs info-modal-data__bold">
                            <div>{`Your ${strings.toTitleCase(
                                this.props.selectedTab
                            )} Price:`}</div>
                            <div>
                                {`${util.moneyFormat(this.finalPrice())}
                                ${
                                    this.props.selectedTab === 'finance' ||
                                    this.props.selectedTab === 'lease'
                                        ? ` /month`
                                        : ``
                                }`}
                            </div>
                        </div>
                        <p className="info-modal-data__disclaimer">
                            * Price includes doc fees, sales tax, and dealer
                            fees but does not include license and registration
                            fees.
                        </p>
                        {this.props.selectedTab === 'cash'
                            ? ''
                            : this.renderPricingDisclaimer()}
                    </div>

                    {this.props.children}
                </div>
            </div>
        );
    }
}

InfoModalData.propTypes = {
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
    closeModal: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOffer = makeDealBestOffer();
    const mapStateToProps = (state, props) => {
        return {
            downPayment: state.downPayment,
            employeeBrand: state.employeeBrand,
            residualPercent: state.residualPercent,
            selectedTab: state.selectedTab,
            selectedDeal: state.selectedDeal,
            termDuration: state.termDuration,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOffer: getDealBestOffer(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(InfoModalData);

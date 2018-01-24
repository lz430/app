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

class InfoModalData extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.targetsAreNotLoaded()) {
            this.requestTargets();
        } else {
            this.componentWillReceiveProps(this.props);
        }

        this.props.requestBestOffer(this.props.deal);
    }

    componentWillUnmount() {
        // this.props.clearBestOffer();
    }

    targetsAreNotLoaded() {
        return (
            !this.props.dealTargets.hasOwnProperty(this.props.deal.id) &&
            this.props.zipcode
        );
    }

    requestTargets() {
        this.props.requestTargets(this.props.deal);
    }

    componentWillReceiveProps(props) {
        // if (!props.dealTargets.hasOwnProperty(props.deal.id)) {
        //     return this.requestTargets();
        // }

        // this.setState({
        //     availableTargets: props.dealTargets[props.deal.id] || [],
        //     selectedTargets: rebates.getSelectedTargetsForDeal(
        //         props.dealTargets,
        //         props.selectedTargets,
        //         props.deal
        //     ),
        //     dealBestOffer: props.dealBestOffer,
        // });
    }

    displayFinalPrice() {
        const selectedAmount = this.props.dealBestOffer
            ? this.props.dealBestOffer.totalValue
            : 0;

        switch (this.props.selectedTab) {
            case 'cash':
                return this.props.deal.supplier_price - selectedAmount;
            case 'finance': {
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.isEmployee
                        ),
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
                            this.props.isEmployee
                        ) - selectedAmount,
                        0,
                        0,
                        this.props.termDuration,
                        R.or(this.props.residualPercent, 31)
                    )
                );
            }
        }
    }

    showAppliedRebates() {
        // const selectedAmount = R.sum(
        //     R.map(R.prop('value'), this.props.selectedTargets)
        // );

        const selectedAmount = 9999; // @todo update to pull from api or whatever

        this.setState({
            selectedRebateAmount: selectedAmount,
        });
    }

    renderAppliedRebatesLink() {
        if (!this.state.availableTargets) {
            return <SVGInline svg={miscicons['loading']} />;
        }

        const selectedAmount = R.sum(
            [0]
            // R.map(R.prop('value'), this.state.selectedTargets)
        );

        return <div>
                <div className="info-modal-data__rebate-info info-modal-data__costs info-modal-data__bold">
                    <div className="info-modal-data__rebate-info__title">{`Rebates Applied:`}</div>
                    <div>{`${util.moneyFormat(this.state.dealBestOffer.totalValue)}`}</div>
                </div>
                {this.state.dealBestOffer.programs.map(
                    (program, index) => {
                        return (
                            <div
                                className="info-modal-data__rebate-info info-modal-data__costs"
                                key={index}
                            >
                                <div className="info-modal-data__rebate-info__title">
                                    {strings.toTitleCase(program.title)}
                                </div>
                                <div>{`${util.moneyFormat(
                                    program.value
                                )}`}</div>
                            </div>
                        );
                    }
                )}

                <div className="info-modal-data__more-rebates info-modal-data__costs">
                    <div>
                        <a onClick={() => {
                                this.props.selectDeal(this.props.deal);

                                this.props.closeModal();
                            }} href="#">
                            Get Rebates
                        </a>
                    </div>
                </div>
            </div>;
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
                            <option>{defaultTermLength}</option>
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
                                this.props.deal.supplier_price *
                                    financeDownPaymentAmount
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

                            {this.state.dealBestOffer
                                ? this.renderAppliedRebatesLink()
                                : 'Loading Applied Rebates...'}
                        </div>

                        <hr />
                        <div className="info-modal-data__final-price info-modal-data__costs info-modal-data__bold">
                            <div>{`Your ${strings.toTitleCase(
                                this.props.selectedTab
                            )} Price:`}</div>
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

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealTargets: state.dealTargets,
        selectedTargets: state.selectedTargets,
        termDuration: state.termDuration,
        selectedDeal: state.selectedDeal,
        isEmployee: state.isEmployee,
        residualPercent: state.residualPercent,
        selectedTargets: state.selectedTargets,
        dealBestOffer: state.dealBestOffer,
    };
};

export default connect(mapStateToProps, Actions)(InfoModalData);

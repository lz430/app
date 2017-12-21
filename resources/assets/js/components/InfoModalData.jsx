import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import formulas from 'src/formulas';
import miscicons from 'miscicons';
import Modal from 'components/Modal';
import PropTypes from "prop-types";
import R from 'ramda';
import React from 'react';
import rebates from 'src/rebates';
import SVGInline from 'react-svg-inline';
import util from 'src/util';

class InfoModalData extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        if (
            !this.props.dealRebates.hasOwnProperty(this.props.deal.id) &&
            this.props.zipcode
        ) {
            this.requestRebates();
        } else {
            this.componentWillReceiveProps(this.props);
        }
    }

    requestRebates() {
        this.props.requestRebates(this.props.deal);
    }

    componentWillReceiveProps(props) {
        if (!props.dealRebates.hasOwnProperty(props.deal.id)) {
            return this.props.requestRebates(this.props.deal);
        }

        this.setState({
            availableRebates: rebates.getAvailableRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.selectedTab,
                props.deal
            ),
            selectedRebates: rebates.getSelectedRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.selectedTab,
                props.deal
            ),
        });
    }

    renderDealRebatesModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
            </Modal>
        );
    }

    fixSelectedTabCaseFormatting() {
        switch (this.props.selectedTab) {
            case 'cash':
                return 'Cash';
            case 'finance':
                return 'Finance';
            case 'lease':
                return 'Lease';
        }
    }

    displayFinalPrice() {
        switch (this.props.selectedTab) {
            case 'cash':
                return this.props.deal.supplier_price;
            case 'finance': {
                return (
                    Math.round(
                        formulas.calculateFinancedMonthlyPayments(
                            util.getEmployeeOrSupplierPrice(
                                this.props.deal,
                                this.props.isEmployee
                            ) -
                            R.sum(
                                R.map(
                                    R.prop('value'),
                                    rebates.getSelectedRebatesForDealAndType(
                                        this.props.dealRebates,
                                        this.props.selectedRebates,
                                        this.props.selectedTab,
                                        this.props.deal
                                    )
                                )
                            ),
                            this.props.downPayment,
                            this.props.termDuration)
                    )
                );
            }
            case 'lease': {
                return Math.round(
                    formulas.calculateLeasedMonthlyPayments(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.isEmployee
                        ) -
                        R.sum(
                            R.map(
                                R.prop('value'),
                                rebates.getSelectedRebatesForDealAndType(
                                    this.props.dealRebates,
                                    this.props.selectedRebates,
                                    this.props.selectedTab,
                                    this.props.deal
                                )
                            )
                        ),
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
        const selectedAmount = R.sum(
            R.map(R.prop('value'), this.props.selectedRebates)
        );
        const maxAmount = R.sum(
            R.map(R.prop('value'), this.props.dealRebates)
        );

        this.setState({
            selectedRebateAmount: selectedAmount,
            maxRebateAmount: maxAmount,
        });
    }

    renderAppliedRebatesLink() {
        if (!this.state.availableRebates) {
            return <SVGInline svg={miscicons['loading']} />;
        }

        const selectedAmount = R.sum(
            R.map(R.prop('value'), this.state.selectedRebates)
        );
        const maxAmount = R.sum(
            R.map(R.prop('value'), this.state.availableRebates)
        );

        return (
            <div>
                <div className="info-modal-data__rebate-info info-modal-data__costs info-modal-data__bold">
                    <div>{`Rebates Applied:`}</div>
                    <div>{`${util.moneyFormat(selectedAmount)}`}</div>
                </div>

                <div className="info-modal-data__more-rebates info-modal-data__costs">
                    <div>{`${util.moneyFormat(maxAmount)} in rebates available.  `}</div>
                    <div>
                        <a
                            onClick={() => this.props.selectDeal(this.props.deal)}
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
        const financeDownPaymentAmount = .10;
        const leaseDownPaymentAmount = .05;
        const defaultTermLength = '60 months';
        const defaultMileage = '10,000 miles';

        if (this.props.selectedTab === 'finance') {
            return (
              <div>
                  <div>
                      <p className="info-modal-data__default-label">Terms</p>
                      <select className="info-modal-data__default-option" disabled>
                          <option>{defaultTermLength}</option>
                      </select>
                  </div>
                  <div>
                      <p className="info-modal-data__default-label">Down Payment</p>
                      <input
                        disabled
                        placeholder={util.moneyFormat(this.props.deal.supplier_price * financeDownPaymentAmount)}
                      />
                  </div>
              </div>
            );
        }
        else {
            return(
                <div>
                    <div className="info-modal-data__defaults">
                        <p className="info-modal-data__default-label">Terms</p>
                        <select className="info-modal-data__default-option" disabled>
                            <option>{defaultTermLength}</option>
                        </select>
                    </div>
                    <div>
                        <p className="info-modal-data__default-label" >Mileage</p>
                        <select className="info-modal-data__default-option" disabled>
                            <option>{defaultMileage}</option>
                        </select>
                    </div>
                    <div className="info-modal-data__defaults">
                        <p className="info-modal-data__default-label">Cash Due</p>
                        <input
                            className="info-modal-data__default-option"
                            disabled
                            placeholder={util.moneyFormat(this.props.deal.supplier_price * leaseDownPaymentAmount)}
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
                    ** Monthly payment is based on 4% simple interest and assumes good
                    to excellent credit rating.
                </p>
            )
        }
        else {
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
                        <p className="info-modal-data__pricing-details">Pricing Details</p>
                        <p>{ `${this.fixSelectedTabCaseFormatting()} Terms`}</p>

                        <div className="info-modal-data__prices">
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">Suggested Retail: </div>
                                <div className="info-modal-data__amount">{util.moneyFormat(this.props.deal.msrp)}</div>
                            </div>
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">Your Price:</div>
                                <div className="info-modal-data__amount">{`${util.moneyFormat(this.props.deal.supplier_price)}*`}</div>
                            </div>

                            {this.props.selectedTab === 'cash' ?
                                '' : this.renderPaymentDefaults()
                            }

                            {this.renderAppliedRebatesLink()}
                        </div>

                        <hr />
                        <div className="info-modal-data__final-price info-modal-data__costs info-modal-data__bold">
                            <div>{`Your ${this.fixSelectedTabCaseFormatting()} Price:`}</div>
                            <div>{`${util.moneyFormat(this.displayFinalPrice())}
                                ${this.props.selectedTab === 'finance' || this.props.selectedTab === 'lease' ? ` /month` : ``}`}
                            </div>
                        </div>
                        <p className="info-modal-data__disclaimer">* Price includes doc fees, sales tax, and
                            dealer fees but does not include license and registration fees.</p>
                        {this.props.selectedTab === 'cash' ?
                            '' : this.renderPricingDisclaimer()
                        }
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
};

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        selectedDeal: state.selectedDeal,
        isEmployee: state.isEmployee,
        residualPercent: state.residualPercent,
    };
};

export default connect(mapStateToProps, Actions)(InfoModalData);

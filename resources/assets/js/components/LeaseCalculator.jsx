import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Rebates from 'components/Rebates';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import rebates from 'src/rebates';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import api from 'src/api';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class LeaseCalculator extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            leaseRates: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        api
            .getLeaseRates(
                this.props.deal.versions[0].jato_vehicle_id,
                this.props.zipcode
            )
            .then(data => {
                if (!this._isMounted) return;

                const closestTermMonths = util.getClosestNumberInRange(
                    R.or(this.props.termDuration, 24),
                    R.map(R.prop('termMonths'), data.data)
                );
                const closestLeaseRate = R.find(leaseRate => {
                    return leaseRate.termMonths === closestTermMonths;
                }, data.data);
                const closestAnnualMileage = this.getClosestAnnualMileage(
                    closestLeaseRate
                );
                const residualPercent = this.getResidualPercent(
                    closestLeaseRate,
                    closestAnnualMileage
                );

                this.props.updateTermDuration(closestLeaseRate.termMonths);
                this.props.updateAnnualMileage(closestAnnualMileage);
                this.props.updateResidualPercent(residualPercent);

                this.setState({
                    leaseRates: data.data,
                });
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getClosestAnnualMileage(leaseRate) {
        return util.getClosestNumberInRange(
            R.or(this.props.annualMileage, 10000),
            R.map(R.prop('annualMileage'), leaseRate.residuals)
        );
    }

    getSelectedLeaseRate(termDuration) {
        return R.find(leaseRate => {
            return Number(leaseRate.termMonths) === termDuration;
        }, this.state.leaseRates);
    }

    getResidualPercent(selectedLeaseRate, annualMileage) {
        return R.propOr(
            null,
            'residualPercent',
            R.find(residual => {
                return residual.annualMileage === annualMileage;
            }, selectedLeaseRate.residuals)
        );
    }

    updateDownPayment(e) {
        this.props.updateDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        const newTermDuration = Number(e.target.value);
        const selectedLeaseRate = this.getSelectedLeaseRate(newTermDuration);
        const closestAnnualMileage = this.getClosestAnnualMileage(
            selectedLeaseRate
        );

        this.props.updateTermDuration(newTermDuration);
        this.props.updateAnnualMileage(closestAnnualMileage);
    }

    updateAnnualMileage(e) {
        const newAnnualMileage = Number(e.target.value);

        this.props.updateAnnualMileage(newAnnualMileage);
        this.props.updateResidualPercent(
            this.getResidualPercent(
                this.getSelectedLeaseRate(this.props.termDuration),
                newAnnualMileage
            )
        );
    }

    renderAnnualMileageSelect() {
        if (
            !(
                this.state.leaseRates &&
                this.props.termDuration &&
                this.props.annualMileage
            )
        )
            return;

        const selectedLeaseRate = this.getSelectedLeaseRate(
            this.props.termDuration
        );

        return (
            <div>
                <span>Annual Mileage</span>
                <span style={{ float: 'right' }}>
                    <select
                        value={this.props.annualMileage}
                        onChange={e => this.updateAnnualMileage(e)}
                    >
                        {selectedLeaseRate ? (
                            selectedLeaseRate.residuals.map(
                                (residual, index) => {
                                    return (
                                        <option
                                            value={residual.annualMileage}
                                            key={index}
                                        >
                                            {residual.annualMileage}
                                        </option>
                                    );
                                }
                            )
                        ) : (
                            ''
                        )}
                    </select>
                </span>
            </div>
        );
    }

    renderMonthlyLeasePayment() {
        if (!(this.props.termDuration && this.props.residualPercent)) return;

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your Monthly Lease Payment
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableRebates ? (
                        util.moneyFormat(
                            Math.round(
                                formulas.calculateLeasedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.isEmployee
                                    ) -
                                        R.sum(
                                            R.map(
                                                R.prop('value'),
                                                this.props.selectedRebates
                                            )
                                        ),
                                    0,
                                    0,
                                    this.props.termDuration,
                                    this.props.residualPercent
                                )
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    renderTermDurationSelect() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Term Duration
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    <select
                        value={this.props.termDuration}
                        onChange={e => this.updateTermDuration(e)}
                    >
                        {this.state.leaseRates ? (
                            this.state.leaseRates.map((leaseRate, index) => {
                                return (
                                    <option
                                        value={leaseRate.termMonths}
                                        key={index}
                                    >
                                        {leaseRate.termMonths}
                                    </option>
                                );
                            })
                        ) : (
                            ''
                        )}
                    </select>
                </span>
            </div>
        );
    }

    renderDueAtSigning() {
        const totalRebates = R.sum(
            R.map(R.prop('value'), this.props.selectedRebates)
        );

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Taxes due at signing
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableRebates ? (
                        util.moneyFormat(
                            formulas.calculateLeaseTaxesDueAtSigning(
                                totalRebates,
                                this.props.downPayment,
                                this.props.deal.doc_fee
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    renderSalesTax() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Sales tax
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    6%
                </span>
            </div>
        );
    }

    renderYourRebatesAndIncentives() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your Rebates and Incentives
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableRebates ? (
                        util.moneyFormat(
                            R.sum(
                                R.map(
                                    R.prop('value'),
                                    this.props.selectedRebates
                                )
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h4>Lease Price</h4>
                {util.moneyFormat(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.isEmployee
                    )
                )}
                <CustomerTypeSelect />
                {this.state.selectedRebates ? (
                    <hr /> + 'Available Rebates and Incentives on Lease'
                ) : (
                    ''
                )}
                <Rebates />
                <hr />
                <h4>Summary</h4>
                <div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            MSRP
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(this.props.deal.msrp)}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Your Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(
                                util.getEmployeeOrSupplierPrice(
                                    this.props.deal,
                                    this.props.isEmployee
                                )
                            )}
                        </span>
                    </div>
                    {this.renderYourRebatesAndIncentives()}
                </div>
                <hr />
                <div>
                    <h4>Lease Summary</h4>
                    {this.renderDueAtSigning()}
                    {this.renderTermDurationSelect()}
                    {this.renderAnnualMileageSelect()}
                </div>
                {/*<div>*/}
                {/*<h4>Select Desired Lease Payment</h4>*/}
                {/*<table>*/}
                {/*<thead>*/}
                {/*<tr>*/}
                {/*<td>Cash Due</td>*/}
                {/*{this.state.leaseRates ? (*/}
                {/*this.state.leaseRates.map((leaseRate, index) => {*/}
                {/*return (*/}
                {/*<td*/}
                {/*value={leaseRate.termMonths}*/}
                {/*key={index}*/}
                {/*>*/}
                {/*{leaseRate.termMonths}*/}
                {/*</td>*/}
                {/*);*/}
                {/*})*/}
                {/*) : (*/}
                {/*''*/}
                {/*)}*/}
                {/*</tr>*/}
                {/*</thead>*/}
                {/*<tbody>*/}
                {/*{this.state.leaseRates ? (*/}
                {/*this.state.leaseRates.map((leaseRate, index) => {*/}
                {/*return <tr key={index}>*/}
                {/*{leaseRate.residuals.map((residual, index) => {*/}
                {/*return <td key={index}>{JSON.stringify(residual)}</td>*/}
                {/*})}*/}
                {/*</tr>;*/}
                {/*})*/}
                {/*) : (*/}
                {/*''*/}
                {/*)}*/}
                {/*</tbody>*/}
                {/*</table>*/}
                {/*</div>*/}
                <div>
                    <h4>Monthly Payment</h4>
                    {this.renderSalesTax()}
                    {this.renderMonthlyLeasePayment()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        downPayment: state.downPayment,
        deal: state.selectedDeal,
        termDuration: state.termDuration,
        annualMileage: state.annualMileage,
        residualPercent: state.residualPercent,
        isEmployee: state.isEmployee,
        availableRebates: rebates.getAvailableRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
        selectedRebates: rebates.getSelectedRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(LeaseCalculator);

import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Targets from 'components/Targets';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
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
            downPayment: 0,
        };
    }

    componentWillMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);

        api
            .getLeaseRates(
                this.props.deal.versions[0].jato_vehicle_id,
                this.props.zipcode
            )
            .then(data => {
                if (!this._isMounted) return;

                const leaseRates = data.data;

                const closestTermMonths = util.getClosestNumberInRange(
                    this.props.termDuration,
                    R.map(R.prop('termMonths'), leaseRates)
                );
                const closestLeaseRate = R.find(leaseRate => {
                    return leaseRate.termMonths === closestTermMonths;
                }, leaseRates);
                const closestAnnualMileage = this.getClosestAnnualMileage(
                    closestLeaseRate
                );
                const residualPercent = this.getResidualPercent(
                    closestLeaseRate,
                    closestAnnualMileage
                );

                this.setState(
                    {
                        leaseRates,
                    },
                    () => {
                        this.props.updateTermDuration(
                            closestLeaseRate.termMonths
                        );
                        this.props.updateAnnualMileage(closestAnnualMileage);
                        this.props.updateResidualPercent(residualPercent);
                    }
                );
            });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // this.props.clearBestOffer();
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

    updateTermDuration(termDuration) {
        const newTermDuration = Number(termDuration);
        const selectedLeaseRate = this.getSelectedLeaseRate(newTermDuration);
        const closestAnnualMileage = this.getClosestAnnualMileage(
            selectedLeaseRate
        );

        this.props.updateTermDuration(newTermDuration);
        this.props.updateAnnualMileage(closestAnnualMileage);
        this.props.updateResidualPercent(
            this.getResidualPercent(selectedLeaseRate, closestAnnualMileage)
        );
    }

    updateAnnualMileage(annualMileage, termDuration) {
        const newAnnualMileage = Number(annualMileage);

        this.props.updateAnnualMileage(newAnnualMileage);
        this.props.updateResidualPercent(
            this.getResidualPercent(
                this.getSelectedLeaseRate(termDuration),
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
                        onChange={e =>
                            this.updateAnnualMileage(
                                e.target.value,
                                this.props.termDuration
                            )
                        }
                    >
                        {selectedLeaseRate
                            ? selectedLeaseRate.residuals.map(
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
                            : ''}
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
                    {this.props.availableTargets ? (
                        util.moneyFormat(
                            formulas.calculateTotalLeaseMonthlyPayment(
                                formulas.calculateLeasedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ) -
                                        R.sum(
                                            [0]
                                            /* @todo update this to pull value from api or whatever
                                            R.map(
                                                R.prop('value'),
                                                this.props.selectedTargets
                                            )
                                            */
                                        ),
                                    this.state.downPayment,
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
                        onChange={e => this.updateTermDuration(e.target.value)}
                    >
                        {this.state.leaseRates
                            ? this.state.leaseRates.map((leaseRate, index) => {
                                  return (
                                      <option
                                          value={leaseRate.termMonths}
                                          key={index}
                                      >
                                          {leaseRate.termMonths}
                                      </option>
                                  );
                              })
                            : ''}
                    </select>
                </span>
            </div>
        );
    }

    renderDueAtSigning() {
        const totalRebates = R.sum(
            [0]
            // R.map(R.prop('value'), this.props.selectedTargets)
        );

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Taxes due at signing
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableTargets ? (
                        util.moneyFormat(
                            formulas.calculateLeaseTaxesDueAtSigning(
                                totalRebates,
                                this.state.downPayment,
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

    renderYourTargets() {
        return <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Rebates Applied
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableTargets ? util.moneyFormat(R.sum(
                                [0]
                            )) : <SVGInline svg={miscicons['loading']
                                /** @todo : replace this to somehow get info back from API best offer call
                                R.map(
                                    R.prop('value'),
                                    this.props.selectedTargets
                                )
                                */
                            } />}
                </span>
            </div>;
    }

    updateFromLeaseTable(termDuration, annualMileage, downPayment) {
        this.setState(
            {
                downPayment,
            },
            () => {
                this.updateTermDuration(termDuration);
                this.updateAnnualMileage(annualMileage, termDuration);
            }
        );
    }

    renderMonthlyRateCell(downPayment, leaseRate, index) {
        const residual = R.find(residual => {
            return residual.annualMileage === this.props.annualMileage;
        }, leaseRate.residuals);

        if (!residual) {
            return <td key={index} />;
        }

        const isSelected =
            leaseRate.termMonths === this.props.termDuration &&
            this.state.downPayment === downPayment;

        const className = `cash-finance-lease-calculator__lease-table-cell--${
            isSelected ? 'selected' : 'selectable'
        }`;

        return (
            <td
                onClick={() =>
                    this.updateFromLeaseTable(
                        leaseRate.termMonths,
                        residual.annualMileage,
                        downPayment
                    )
                }
                className={className}
                key={index}
            >
                {util.moneyFormat(
                    formulas.calculateTotalLeaseMonthlyPayment(
                        formulas.calculateLeasedMonthlyPayments(
                            util.getEmployeeOrSupplierPrice(
                                this.props.deal,
                                this.props.employeeBrand
                            ) -
                                R.sum(
                                    [0]
                                    // R.map(
                                    //     R.prop('value'),
                                    //     this.props.selectedTargets
                                    // )
                                ),
                            downPayment,
                            0,
                            leaseRate.termMonths,
                            residual.residualPercent
                        )
                    )
                )}
            </td>
        );
    }

    render() {
        return (
            <div>
                Lease Price{' '}
                {util.moneyFormat(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    )
                )}
                <CustomerTypeSelect deal={this.props.deal} />
                {/* {this.state.selectedTargets ? (
                    <div>
                        <hr />
                        <h4>Available Rebates and Incentives</h4>
                    </div>
                ) : (
                    ''
                )} */}
                <Targets
                    deal={this.props.deal}
                    targetsChanged={this.props.requestBestOffer.bind(
                        this,
                        this.props.deal
                    )}
                />
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
                                    this.props.employeeBrand
                                )
                            )}
                        </span>
                    </div>
                    {this.renderYourTargets()}
                </div>
                <hr />
                <div>
                    <h4>Lease Summary</h4>
                    {this.renderDueAtSigning()}
                    {this.renderTermDurationSelect()}
                    {this.renderAnnualMileageSelect()}
                </div>
                <div>
                    <h4>Select Desired Lease Payment</h4>
                    <table className="cash-finance-lease-calculator__lease-table">
                        <thead>
                            <tr>
                                <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                    Cash Due
                                </td>
                                {this.state.leaseRates ? (
                                    this.state.leaseRates.map(
                                        (leaseRate, index) => {
                                            return (
                                                <td
                                                    className="cash-finance-lease-calculator__lease-table-cell--dark"
                                                    value={leaseRate.termMonths}
                                                    key={index}
                                                >
                                                    {leaseRate.termMonths}{' '}
                                                    Months
                                                </td>
                                            );
                                        }
                                    )
                                ) : (
                                    <td />
                                )}
                            </tr>
                        </thead>
                        {this.state.leaseRates ? (
                            <tbody>
                                <tr>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        $0
                                    </td>
                                    {this.state.leaseRates.map(
                                        this.renderMonthlyRateCell.bind(this, 0)
                                    )}
                                </tr>

                                <tr>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        $1000
                                    </td>
                                    {this.state.leaseRates.map(
                                        this.renderMonthlyRateCell.bind(
                                            this,
                                            1000
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        $2500
                                    </td>
                                    {this.state.leaseRates.map(
                                        this.renderMonthlyRateCell.bind(
                                            this,
                                            2500
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        $5000
                                    </td>
                                    {this.state.leaseRates.map(
                                        this.renderMonthlyRateCell.bind(
                                            this,
                                            5000
                                        )
                                    )}
                                </tr>
                            </tbody>
                        ) : (
                            <tbody />
                        )}
                    </table>
                </div>
                <div>
                    <h4>Monthly Payment * </h4>
                    {this.renderSalesTax()}
                    {this.renderMonthlyLeasePayment()}
                </div>
                <div className="disclaimer">
                    * $0 due statement *payments include first months' payment
                    and all other inception fees except license plate cost.
                    $1000 or $2500 due at signing statement *payments include
                    first months' payment and all other inception fees except
                    license plate cost. Actual payment may vary slightly more or
                    less.
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        deal: state.selectedDeal,
        termDuration: state.termDuration,
        annualMileage: state.annualMileage,
        residualPercent: state.residualPercent,
        employeeBrand: state.employeeBrand,
        dealBestOffer: state.dealBestOffer,
    };
}

export default connect(mapStateToProps, Actions)(LeaseCalculator);

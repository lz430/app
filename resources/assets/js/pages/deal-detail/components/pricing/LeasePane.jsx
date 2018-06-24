import React from 'react';
import Discount from './Discount';
import Rebates from '../../containers/pricing/rebates/Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';

export default class LeasePane extends React.PureComponent {
    static defaultProps = {
        onDiscountChange: (discountType, make = null) => {},
        onRebatesChange: () => {},
        onTermChange: term => {},
        onAnnualMileageChange: annualMileage => {},
        onCashDueChange: () => {},
        onChange: () => {},
    };

    render() {
        const { dealPricing, onDiscountChange, onRebatesChange } = this.props;

        return (
            <div>
                <Line>
                    <Label>MSRP</Label>
                    <Value>{dealPricing.msrp()}</Value>
                </Line>
                <Discount {...{ dealPricing }} onChange={onDiscountChange} />
                <Line>
                    <Label>Selling Price</Label>
                    <Value>{dealPricing.baseSellingPrice()}</Value>
                </Line>
                {dealPricing.bestOfferValue() > 0 && (
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value isNegative={true}>
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                )}
                <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                <Line>
                    <Label>Total Price</Label>
                    <Value>{dealPricing.yourPrice()}*</Value>
                </Line>
                <hr />
                <Line>
                    <Label>Annual Miles</Label>
                    <Value>
                        <select
                            value={this.props.dealPricing.leaseAnnualMileageValue()}
                            onChange={this.handleAnnualMileageChange}
                        >
                            {this.props.dealPricing
                                .leaseAnnualMileageAvailable()
                                .map((annualMileage, annualMileageIndex) => {
                                    return (
                                        <option
                                            key={annualMileageIndex}
                                            value={annualMileage}
                                        >
                                            {annualMileage}
                                        </option>
                                    );
                                })}
                        </select>
                    </Value>
                </Line>
                <Line>
                    <div className="cash-finance-lease-calculator__lease-table-container">
                        <table className="cash-finance-lease-calculator__lease-table">
                            <thead>
                                <tr>
                                    {/*<td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        Cash Due
                                    </td>*/}
                                    {this.props.dealPricing.leaseTermsAvailable() &&
                                        this.props.dealPricing
                                            .leaseTermsAvailable()
                                            .filter(term => {
                                                return this.props.dealPricing.hasLeasePaymentsForTerm(
                                                    term
                                                );
                                            })
                                            .map((term, index) => {
                                                return (
                                                    <td
                                                        className="cash-finance-lease-calculator__lease-table-cell--dark"
                                                        key={index}
                                                    >
                                                        {term} Months
                                                    </td>
                                                );
                                            })}
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.dealPricing.leaseTermsAvailable() &&
                                    this.props.dealPricing.leaseCashDueAvailable() &&
                                    this.props.dealPricing
                                        .leaseCashDueAvailable()
                                        .map((cashDue, indexCashDue) => {
                                            return (
                                                <tr key={indexCashDue}>
                                                    {/*<td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                            {util.moneyFormat(cashDue
                                        )}</td>*/}
                                                    {this.props.dealPricing
                                                        .leaseTermsAvailable()
                                                        .filter(term => {
                                                            return this.props.dealPricing.hasLeasePaymentsForTerm(
                                                                term
                                                            );
                                                        })
                                                        .map(
                                                            (
                                                                term,
                                                                termIndex
                                                            ) => {
                                                                let className = this.props.dealPricing.isSelectedLeasePaymentForTermAndCashDue(
                                                                    term,
                                                                    cashDue
                                                                )
                                                                    ? 'cash-finance-lease-calculator__lease-table-cell--selected'
                                                                    : 'cash-finance-lease-calculator__lease-table-cell--selectable';

                                                                return (
                                                                    <td
                                                                        className={
                                                                            className
                                                                        }
                                                                        key={
                                                                            termIndex
                                                                        }
                                                                        onClick={() =>
                                                                            this.props.onChange(
                                                                                this.props.dealPricing.leaseAnnualMileageValue(),
                                                                                term,
                                                                                cashDue
                                                                            )
                                                                        }
                                                                    >
                                                                        {this.props.dealPricing.leasePaymentsForTermAndCashDue(
                                                                            term,
                                                                            cashDue
                                                                        )}
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                </tr>
                                            );
                                        })}
                            </tbody>
                        </table>
                    </div>
                </Line>
                <Line>
                    <Label>Term Length</Label>
                    <Value>{dealPricing.leaseTerm()}</Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Monthly Payment</Label>
                    <Value>{dealPricing.monthlyPayments()}*</Value>
                </Line>
            </div>
        );
    }

    handleTermChange = e => {
        this.props.onTermChange(Number(e.target.value));
    };

    handleAnnualMileageChange = e => {
        this.props.onAnnualMileageChange(Number(e.target.value));
    };

    handleCashDueChange = e => {
        this.props.onCashDueChange(Number(e.target.value));
    };
}

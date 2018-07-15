import React from 'react';
import Modal from '../../../../components/Modal';

export default class LeaseTermsSelect extends React.PureComponent {
    static defaultProps = {
        onChange: (annualMileage, term, cashDue) => {},
        onClose: () => {},
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <Modal title="Select your lease terms" onClose={this.props.onClose}>
                <div className="cash-finance-lease-calculator__lease-table-container">
                    <table className="cash-finance-lease-calculator__lease-table">
                        <thead>
                            <tr>
                                {
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        Annual Miles
                                    </td>
                                }
                                {dealPricing.leaseTermsAvailable() &&
                                    dealPricing
                                        .leaseTermsAvailable()
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
                            {dealPricing.leaseTermsAvailable() &&
                                dealPricing.leaseAnnualMileageAvailable() &&
                                dealPricing
                                    .leaseAnnualMileageAvailable()
                                    .map(
                                        (annualMileage, indexAnnualMileage) => {
                                            const cashDue = 0;
                                            return (
                                                <tr key={indexAnnualMileage}>
                                                    {
                                                        <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                                            {annualMileage.toLocaleString()}
                                                        </td>
                                                    }
                                                    {dealPricing
                                                        .leaseTermsAvailable()
                                                        .map(
                                                            (
                                                                term,
                                                                termIndex
                                                            ) => {
                                                                let className = dealPricing.isSelectedLeasePaymentForTermAndCashDue(
                                                                    term,
                                                                    cashDue,
                                                                    annualMileage
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
                                                                                annualMileage,
                                                                                term,
                                                                                cashDue
                                                                            )
                                                                        }
                                                                    >
                                                                        {dealPricing.leasePaymentsForTermAndCashDue(
                                                                            term,
                                                                            cashDue,
                                                                            annualMileage
                                                                        )}
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                </tr>
                                            );
                                        }
                                    )}
                        </tbody>
                    </table>
                </div>
            </Modal>
        );
    }
}

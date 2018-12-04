import React from 'react';
import PropTypes from 'prop-types';

import Dollars from '../../../../components/money/Dollars';
import { pricingType } from '../../../../core/types';

export default class PaymentLeaseTermsSelect extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    renderTableHeader(pricing) {
        return (
            <thead>
                <tr>
                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                        Miles/Yr.
                    </td>
                    {pricing.termsAvailable().map((term, index) => {
                        return (
                            <td
                                className="cash-finance-lease-calculator__lease-table-cell--dark"
                                key={index}
                            >
                                {term} MO
                            </td>
                        );
                    })}
                </tr>
            </thead>
        );
    }

    renderTerm(pricing, term, termIndex, annualMileage) {
        const value = pricing.paymentsForTermAndMileage(term, annualMileage);

        if (value) {
            let className = pricing.isSelectedLeasePaymentForTermAndMileage(
                term,
                annualMileage
            )
                ? 'cash-finance-lease-calculator__lease-table-cell--selected'
                : 'cash-finance-lease-calculator__lease-table-cell--selectable';

            return (
                <td
                    className={className}
                    key={termIndex}
                    onClick={() => this.props.onChange(annualMileage, term, 0)}
                >
                    <Dollars value={value} />
                </td>
            );
        } else {
            return (
                <td
                    className="cash-finance-lease-calculator__lease-table-cell--disabled"
                    key={termIndex}
                >
                    N/A
                </td>
            );
        }
    }

    renderTableBody(pricing) {
        return (
            <tbody>
                {pricing
                    .annualMileageAvailable()
                    .map((annualMileage, indexAnnualMileage) => {
                        return (
                            <tr key={indexAnnualMileage}>
                                <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                    {annualMileage
                                        ? annualMileage.toLocaleString()
                                        : 'N/A'}
                                </td>
                                {pricing
                                    .termsAvailable()
                                    .map((term, termIndex) => {
                                        return this.renderTerm(
                                            pricing,
                                            term,
                                            termIndex,
                                            annualMileage
                                        );
                                    })}
                            </tr>
                        );
                    })}
            </tbody>
        );
    }

    render() {
        const { pricing } = this.props;

        if (!pricing.termsAvailable() || !pricing.annualMileageAvailable()) {
            return false;
        }

        return (
            <div className="cash-finance-lease-calculator__lease-table-container">
                <table className="cash-finance-lease-calculator__lease-table text-sm">
                    {this.renderTableHeader(pricing)}
                    {this.renderTableBody(pricing)}
                </table>
            </div>
        );
    }
}

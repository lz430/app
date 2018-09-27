import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Dollars from '../../../../components/money/Dollars';
import { pricingType } from '../../../../types';

export default class LeaseTermsSelect extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    renderTableHeader(pricing) {
        return (
            <thead>
                <tr>
                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                        Annual Miles
                    </td>
                    {pricing.termsAvailable().map((term, index) => {
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
        );
    }

    renderTerm(pricing, term, termIndex, annualMileage) {
        const value = pricing.paymentsForTermAndCashDue(term, 0, annualMileage);

        if (value) {
            let className = pricing.isSelectedLeasePaymentForTermAndCashDue(
                term,
                0,
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
            <Modal
                size="content-fit"
                centered
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>
                    Select your lease terms
                </ModalHeader>
                <ModalBody>
                    <div className="cash-finance-lease-calculator__lease-table-container">
                        <table className="cash-finance-lease-calculator__lease-table">
                            {this.renderTableHeader(pricing)}
                            {this.renderTableBody(pricing)}
                        </table>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

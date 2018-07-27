import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class LeaseTermsSelect extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        dealPricing: PropTypes.object,
    };

    renderTableHeader() {
        const { dealPricing } = this.props;

        return (
            <thead>
                <tr>
                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                        Annual Miles
                    </td>
                    {dealPricing.leaseTermsAvailable().map((term, index) => {
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

    renderLeaseTerm(dealPricing, term, termIndex, annualMileage) {
        let className = dealPricing.isSelectedLeasePaymentForTermAndCashDue(
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
                {dealPricing.leasePaymentsForTermAndCashDue(
                    term,
                    0,
                    annualMileage
                )}
            </td>
        );
    }

    renderTableBody() {
        const { dealPricing } = this.props;

        return (
            <tbody>
                {dealPricing
                    .leaseAnnualMileageAvailable()
                    .map((annualMileage, indexAnnualMileage) => {
                        return (
                            <tr key={indexAnnualMileage}>
                                <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                    {annualMileage.toLocaleString()}
                                </td>
                                {dealPricing
                                    .leaseTermsAvailable()
                                    .map((term, termIndex) => {
                                        return this.renderLeaseTerm(
                                            dealPricing,
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
        const { dealPricing } = this.props;

        if (
            !dealPricing.leaseTermsAvailable() ||
            dealPricing.leaseAnnualMileageAvailable()
        ) {
            return false;
        }

        return (
            <Modal
                className="rebate-description-modal"
                size="lg"
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>
                    Select your lease terms
                </ModalHeader>
                <ModalBody>
                    <div className="cash-finance-lease-calculator__lease-table-container">
                        <table className="cash-finance-lease-calculator__lease-table">
                            {this.renderTableHeader()}
                            {this.renderTableBody()}
                        </table>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

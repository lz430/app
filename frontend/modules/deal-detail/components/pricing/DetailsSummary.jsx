import React from 'react';
import PropTypes from 'prop-types';

import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';

export default class TaxesAndFees extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    renderCashDetails() {
        return (
            <React.Fragment>
                <div className="mb-2">Cash Deal Summary</div>
                <h5 className="font-weight-bold border-bottom border-medium d-inline-block m-0">
                    Final Price:{' '}
                    <DollarsAndCents value={this.props.pricing.yourPrice()} />
                </h5>
                <div className="text-sm">
                    Taxes & Fees:{' '}
                    <DollarsAndCents
                        value={this.props.pricing.taxesAndFees()}
                    />
                </div>
            </React.Fragment>
        );
    }

    renderFinanceDetails() {
        return (
            <React.Fragment>
                <div className="mb-2">Finance Deal Summary</div>
                <h5 className="font-weight-bold border-bottom border-medium d-inline-block m-0">
                    Payment:{' '}
                    <DollarsAndCents
                        value={this.props.pricing.monthlyPayment()}
                    />
                    /mo
                </h5>
                <div className="text-sm">
                    Down Payment:{' '}
                    <DollarsAndCents value={this.props.pricing.downPayment()} />
                </div>
                <div className="text-sm">Term: {this.props.pricing.term()}</div>
            </React.Fragment>
        );
    }

    renderLeaseDetails() {
        return (
            <React.Fragment>
                <div className="mb-2">Lease Deal Summary</div>
                <h5 className="font-weight-bold border-bottom border-medium d-inline-block m-0">
                    Payment:{' '}
                    <DollarsAndCents
                        value={this.props.pricing.monthlyPayment()}
                    />
                    /mo
                </h5>
                <div className="text-sm">
                    Miles: {this.props.pricing.annualMileage()}
                </div>
                <div className="text-sm">Term: {this.props.pricing.term()}</div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="p-4 border border-medium text-center">
                {this.props.purchaseStrategy === 'cash' &&
                    this.renderCashDetails()}
                {this.props.purchaseStrategy === 'finance' &&
                    this.renderFinanceDetails()}
                {this.props.purchaseStrategy === 'lease' &&
                    this.renderLeaseDetails()}
            </div>
        );
    }
}

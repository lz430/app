import React from 'react';
import PropTypes from 'prop-types';
import { pricingType } from '../../../../core/types';

import Loading from '../../../../components/Loading';
import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

import PaymentLeaseTermsSelect from './PaymentLeaseTermsSelect';

import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class PaymentLease extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        leaseTermsSelectOpened: false,
        paymentPopoverOpen: false,
        duePopoverOpen: false,
    };

    togglePaymentDescription() {
        this.setState({
            paymentPopoverOpen: !this.state.paymentPopoverOpen,
        });
    }

    handleLeaseTermsChange = (annualMileage, term, cashDue) => {
        this.props.onChange(annualMileage, term, cashDue);
        this.toggleTermsSelect();
    };

    toggleTermsSelect() {
        this.setState({
            leaseTermsSelectOpened: !this.state.leaseTermsSelectOpened,
        });
    }

    renderPaymentDescription() {
        const { pricing } = this.props;

        return (
            <Popover
                placement="left"
                isOpen={this.state.paymentPopoverOpen}
                target="lease-explain"
                toggle={this.togglePaymentDescription.bind(this)}
            >
                <PopoverHeader>Payment Breakdown</PopoverHeader>
                <PopoverBody>
                    <Line>
                        <Label>Pre-Tax Payment</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.monthlyPreTaxPayment()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Use Tax</Label>
                        <Value>
                            <DollarsAndCents value={pricing.monthlyUseTax()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Monthly Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.monthlyPayment()} />
                        </Value>
                    </Line>
                </PopoverBody>
            </Popover>
        );
    }

    render() {
        const { pricing } = this.props;

        return (
            <div>
                <div className="text-center mb-4 mt-4">
                    <div>Your Lease Payment</div>
                    <h3 className="font-weight-bold m-0">
                        <DollarsAndCents value={pricing.monthlyPayment()} />
                    </h3>
                </div>
                <Separator />
                <Group>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <Line>
                                <div>Select Lease Terms</div>
                                <PaymentLeaseTermsSelect
                                    pricing={pricing}
                                    isOpen={this.state.leaseTermsSelectOpened}
                                    toggle={this.toggleTermsSelect.bind(this)}
                                    onChange={this.handleLeaseTermsChange.bind(
                                        this
                                    )}
                                />
                            </Line>
                        </div>
                    )}
                </Group>
                <Separator />
                <Group>
                    <Header>Due at Delivery</Header>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                            *
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}

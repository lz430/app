import React from 'react';
import PropTypes from 'prop-types';
import { pricingType } from '../../../../core/types';

import Loading from '../../../../components/Loading';
import Line from '../../../../apps/pricing/components/Line';
import Group from '../../../../apps/pricing/components/Group';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

import PaymentLeaseTermsSelect from './PaymentLeaseTermsSelect';
import { Input, FormGroup, Label } from 'reactstrap';

export default class PaymentLease extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    handleLeaseTermsChange = (annualMileage, term, cashDue) => {
        this.props.onChange(annualMileage, term, cashDue);
    };

    handleCashDueChange = e => {
        const newDownPayment = Number(
            Math.round(e.target.value.replace(/[\D.]/g, ''))
        );

        if (isNaN(newDownPayment)) {
            return;
        }

        if (newDownPayment < 0) {
            return;
        }

        this.props.onChange(
            this.props.pricing.annualMileage(),
            this.props.pricing.term(),
            newDownPayment
        );
    };

    render() {
        const { pricing } = this.props;

        if (pricing.quoteIsLoading()) {
            return <Loading size={4} />;
        }

        return (
            <div>
                <div className="text-center mb-4 mt-4">
                    <div>Your Lease Payment</div>
                    <h3 className="font-weight-bold m-0">
                        <DollarsAndCents value={pricing.monthlyPayment()} />
                    </h3>
                </div>
                <Separator />
                <div className="d-flex">
                    <div className="pr-1">
                        <FormGroup>
                            <Label for="down-payment" className="text-sm">
                                Down Payment
                            </Label>
                            <Input
                                type="text"
                                name="down-payment"
                                value={pricing.cashDue().toFormat('0,0')}
                                onChange={this.handleCashDueChange}
                            />
                        </FormGroup>
                    </div>
                </div>

                <Separator />
                <Group>
                    <div>
                        <Line>
                            <div>Select Lease Terms</div>
                            <PaymentLeaseTermsSelect
                                pricing={pricing}
                                onChange={this.handleLeaseTermsChange.bind(
                                    this
                                )}
                            />
                        </Line>
                    </div>
                </Group>
            </div>
        );
    }
}

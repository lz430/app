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

export default class PaymentLease extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    handleLeaseTermsChange = (annualMileage, term, cashDue) => {
        this.props.onChange(annualMileage, term, cashDue);
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

import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../../components/Loading';

import Group from '../../../../apps/pricing/components/Group';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import { Button, ButtonGroup, Input, FormGroup, Label } from 'reactstrap';

import Separator from '../../../../apps/pricing/components/Separator';

export default class PaymentFinance extends React.PureComponent {
    static propTypes = {
        onRebatesChange: PropTypes.func.isRequired,
        onDownPaymentChange: PropTypes.func.isRequired,
        onTermChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    terms = [24, 36, 48, 60, 72, 84];

    handleDownPaymentChange = e => {
        const newDownPayment = Number(
            Math.round(e.target.value.replace(/[\D.]/g, ''))
        );

        if (isNaN(newDownPayment)) {
            return;
        }

        if (newDownPayment < 0) {
            return;
        }

        const maxDownPayment = this.props.pricing.maxDownPayment();
        if (newDownPayment > maxDownPayment.getAmount() / 100) {
            this.props.onDownPaymentChange(maxDownPayment.toFormat('0,0'));
            return;
        }

        this.props.onDownPaymentChange(newDownPayment);
    };

    handlePercentDownPaymentChange = e => {
        const percentDownPayment = Number(
            Math.round(e.target.value.replace(/[\D.]/g, ''))
        );

        if (isNaN(percentDownPayment)) {
            return false;
        }

        if (percentDownPayment < 0) {
            return false;
        }

        if (percentDownPayment > 100) {
            return false;
        }
        console.log('handlePercentDownPaymentChange');
        console.log(percentDownPayment);
        const newDownPayment = this.props.pricing
            .calculateDownPayment(percentDownPayment / 100)
            .toRoundedUnit(0);
        console.log(newDownPayment);
        this.props.onDownPaymentChange(newDownPayment);
    };

    handleTermChange(term) {
        this.props.onTermChange(Number(term));
    }

    render() {
        const { pricing } = this.props;

        return (
            <div>
                <div className="text-center mb-4 mt-4">
                    <div>Your Finance Payment</div>
                    <h3 className="font-weight-bold m-0">
                        <DollarsAndCents value={pricing.monthlyPayment()} />
                    </h3>
                </div>
                <Separator />
                <Group isLoading={pricing.quoteIsLoading()}>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <div className="d-flex">
                                <div className="pr-1">
                                    <FormGroup>
                                        <Label
                                            for="down-payment"
                                            className="text-sm"
                                        >
                                            Down Payment
                                        </Label>
                                        <Input
                                            type="text"
                                            name="down-payment"
                                            value={pricing
                                                .downPayment()
                                                .toFormat('0,0')}
                                            onChange={
                                                this.handleDownPaymentChange
                                            }
                                        />
                                    </FormGroup>
                                </div>
                                <div className="pl-1">
                                    <FormGroup>
                                        <Label
                                            for="down-payment-percent"
                                            className="text-sm"
                                        >
                                            Down Payment %
                                        </Label>
                                        <Input
                                            type="text"
                                            name="down-payment-percent"
                                            value={pricing.downPaymentPercent()}
                                            onChange={
                                                this
                                                    .handlePercentDownPaymentChange
                                            }
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="cart__finance-term">
                                <div className="text-sm">Select Term</div>
                                <ButtonGroup className="d-flex">
                                    {this.terms.map(term => (
                                        <Button
                                            key={term}
                                            color="secondary"
                                            outline
                                            onClick={() =>
                                                this.handleTermChange(term)
                                            }
                                            active={pricing.term() === term}
                                            className="w-100"
                                        >
                                            {term}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                        </div>
                    )}
                </Group>
            </div>
        );
    }
}

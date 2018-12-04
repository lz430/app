import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../../components/Loading';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import { Button, ButtonGroup, Input, FormGroup } from 'reactstrap';

import Separator from '../../../../apps/pricing/components/Separator';

export default class FinancePane extends React.PureComponent {
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
            this.props.onDownPaymentChange(maxDownPayment.toFormat('$0,0'));
            return;
        }

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
                                        <Label for="down-payment">
                                            Down Payment
                                        </Label>
                                        <Input
                                            type="text"
                                            name="down-payment"
                                            value={pricing
                                                .downPayment()
                                                .toFormat('$0,0')}
                                            onChange={
                                                this.handleDownPaymentChange
                                            }
                                        />
                                    </FormGroup>
                                </div>
                                <div className="pl-1">
                                    <FormGroup>
                                        <Label for="down-payment">
                                            Down Payment %
                                        </Label>
                                        <Input
                                            type="text"
                                            name="down-payment"
                                            value={pricing
                                                .downPayment()
                                                .toFormat('$0,0')}
                                            onChange={
                                                this.handleDownPaymentChange
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

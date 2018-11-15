import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../../components/Loading';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import {
    Popover,
    PopoverHeader,
    PopoverBody,
    Button,
    ButtonGroup,
} from 'reactstrap';
import Rebates from './Rebates';
import TaxesAndFees from './TaxesAndFees';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

export default class FinancePane extends React.PureComponent {
    static propTypes = {
        onRebatesChange: PropTypes.func.isRequired,
        onDownPaymentChange: PropTypes.func.isRequired,
        onTermChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        popoverOpen: false,
    };

    terms = [24, 36, 48, 60, 72, 84];

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
    }

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

    renderDescription() {
        const { pricing } = this.props;

        return (
            <Popover
                placement="left"
                isOpen={this.state.popoverOpen}
                target="finance-explain"
                toggle={this.toggle.bind(this)}
            >
                <PopoverHeader>Finance Breakdown</PopoverHeader>
                <PopoverBody className="text-sm">
                    <Line>
                        <Label>Amount Financed </Label>
                        <Value
                            style={{
                                marginLeft: '10px',
                                display: 'inline-block',
                            }}
                        >
                            <DollarsAndCents value={pricing.amountFinanced()} />
                        </Value>
                    </Line>
                </PopoverBody>
            </Popover>
        );
    }

    render() {
        const { pricing, onRebatesChange } = this.props;

        return (
            <div>
                <TaxesAndFees pricing={this.props.pricing} />
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    <Rebates pricing={pricing} onChange={onRebatesChange} />
                </Group>
                <Separator />
                <Line>
                    <Label style={{ margin: 0 }}>Total Selling Price</Label>
                    <Value isLoading={pricing.quoteIsLoading()}>
                        <DollarsAndCents value={pricing.yourPrice()} />*
                    </Value>
                </Line>
                <Separator />
                <Group isLoading={pricing.quoteIsLoading()}>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <div className="cart__finance-down-payment">
                                <input
                                    className="border border-primary text-center p-1 text-center"
                                    type="text"
                                    name="down-payment"
                                    value={pricing
                                        .downPayment()
                                        .toFormat('$0,0')}
                                    onChange={this.handleDownPaymentChange}
                                />
                                <div className="text-sm">
                                    Select Down Payment
                                </div>
                            </div>

                            <div className="cart__finance-term text-center mt-3">
                                <ButtonGroup>
                                    {this.terms.map(term => (
                                        <Button
                                            key={term}
                                            color="secondary"
                                            outline
                                            onClick={() =>
                                                this.handleTermChange(term)
                                            }
                                            active={pricing.term() === term}
                                        >
                                            {term}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <div className="text-sm">Select Term</div>
                            </div>
                            <hr />
                            <Line isImportant={true}>
                                <Label>
                                    Monthly Payment{' '}
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="cursor-pointer"
                                        id="finance-explain"
                                        onClick={this.toggle.bind(this)}
                                    />
                                </Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.monthlyPayment()}
                                    />
                                </Value>
                            </Line>
                        </div>
                    )}
                </Group>
                {this.renderDescription()}
            </div>
        );
    }
}

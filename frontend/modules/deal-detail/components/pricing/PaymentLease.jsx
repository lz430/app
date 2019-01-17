import React from 'react';
import PropTypes from 'prop-types';
import { pricingType } from '../../../../core/types';

import Loading from '../../../../components/Loading';
import Line from '../../../../apps/pricing/components/Line';
import Group from '../../../../apps/pricing/components/Group';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

import PaymentLeaseTermsSelect from './PaymentLeaseTermsSelect';
import {
    Input,
    InputGroup,
    InputGroupAddon,
    FormGroup,
    Label,
} from 'reactstrap';
import Value from '../../../../apps/pricing/components/Value';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

export default class PaymentLease extends React.PureComponent {
    static propTypes = {
        isDealQuoteRefreshing: PropTypes.bool.isRequired,
        pricing: pricingType.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        popoverOpen: false,
    };

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
    }

    renderDescription() {
        const pricing = this.props.pricing;
        return (
            <Popover
                placement="left"
                isOpen={this.state.popoverOpen}
                target="lease-due-explain"
                toggle={this.toggle.bind(this)}
            >
                <PopoverHeader>Due at Delivery</PopoverHeader>
                <PopoverBody className="text-xs cart__rebate_description">
                    <Line>
                        <Label>First Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.firstPayment()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Doc Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.docFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Electronic Filing Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.cvrFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Taxes</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.taxesDueAtDelivery()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Down Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.cashDownCCR()} />
                        </Value>
                    </Line>
                    <Line isSemiImportant>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                        </Value>
                    </Line>
                </PopoverBody>
            </Popover>
        );
    }

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
                <div className="cart__payment-summary text-center mb-4 mt-4">
                    <div>Your Lease Payment</div>
                    <h3 className="font-weight-bold m-0">
                        <DollarsAndCents value={pricing.monthlyPayment()} />
                    </h3>
                    {this.props.isDealQuoteRefreshing && <Loading size={2} />}
                </div>
                <Separator />
                <div>
                    <div className="pr-1">
                        <FormGroup>
                            <Label for="down-payment" className="text-sm">
                                Additional Down Payment
                            </Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    $
                                </InputGroupAddon>
                                <Input
                                    type="text"
                                    name="down-payment"
                                    value={pricing.cashDue().toFormat('0,0')}
                                    onChange={this.handleCashDueChange}
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                    <Line isSectionTotal>
                        <Label>
                            Due at Delivery{' '}
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="cursor-pointer"
                                id="lease-due-explain"
                                onClick={this.toggle.bind(this)}
                            />
                            {this.renderDescription()}
                        </Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                        </Value>
                    </Line>
                </div>
                <Separator />
                <Group>
                    <div>
                        <Line>
                            <div className="text-sm">Select Lease Terms</div>
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

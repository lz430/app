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

import LeaseTermsSelect from './LeaseTermsSelect';
import Rebates from './Rebates';

import { faEdit, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class LeasePane extends React.PureComponent {
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

    toggleDueDescription() {
        this.setState({
            duePopoverOpen: !this.state.duePopoverOpen,
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

    renderDueDescription() {
        const { pricing } = this.props;

        return (
            <Popover
                placement="left"
                isOpen={this.state.duePopoverOpen}
                target="lease-due-explain"
                toggle={this.toggleDueDescription.bind(this)}
            >
                <PopoverHeader>Due At Delivery Breakdown</PopoverHeader>
                <PopoverBody>
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
                        <Label>Tax on Rebates</Label>
                        <Value>
                            <DollarsAndCents value={pricing.taxOnRebates()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                            *
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
                <Group>
                    <Header>Rebates</Header>
                    <Rebates pricing={pricing} onChange={onRebatesChange} />
                </Group>
                <Separator />
                <Group>
                    <Header>
                        Lease Terms
                        <Button
                            color="primary"
                            onClick={() => this.toggleTermsSelect()}
                            style={{
                                marginLeft: 'auto',
                                fontSize: '0.8rem',
                                padding: '0.1rem 0.25rem',
                            }}
                        >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                    </Header>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <Line>
                                <table
                                    style={{
                                        border: '1px solid black',
                                        borderSpacing: 0,
                                        padding: '.5em 0',
                                        margin: '1em auto',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => this.toggleTermsSelect()}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    fontWeight: 100,
                                                    fontSize: '.75em',
                                                    padding: '.25em 1em 0',
                                                    borderRight:
                                                        '1px solid black',
                                                }}
                                            >
                                                Annual Miles
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 100,
                                                    fontSize: '.75em',
                                                    padding: '.25em 1em 0',
                                                }}
                                            >
                                                Months
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    padding: '0 1em .25em',
                                                    borderRight:
                                                        '1px solid black',
                                                }}
                                            >
                                                {pricing.annualMileage()}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    padding: '0 1em .25em',
                                                }}
                                            >
                                                {pricing.term()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Line>
                            <Line isImportant={true}>
                                <Label>
                                    Monthly Payment{' '}
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="cursor-pointer"
                                        id="lease-explain"
                                        onClick={this.togglePaymentDescription.bind(
                                            this
                                        )}
                                    />
                                    {this.renderPaymentDescription()}
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
                <Separator />
                <Group>
                    <Header>Due at Delivery</Header>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>
                            Total Due{' '}
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="cursor-pointer"
                                id="lease-due-explain"
                                onClick={this.toggleDueDescription.bind(this)}
                            />
                            {this.renderDueDescription()}
                        </Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                            *
                        </Value>
                    </Line>
                </Group>
                {this.state.leaseTermsSelectOpened && (
                    <LeaseTermsSelect
                        pricing={pricing}
                        isOpen={this.state.leaseTermsSelectOpened}
                        toggle={this.toggleTermsSelect.bind(this)}
                        onChange={this.handleLeaseTermsChange.bind(this)}
                    />
                )}
            </div>
        );
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
}

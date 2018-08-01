import React from 'react';
import PropTypes from 'prop-types';

import Compose from 'icons/zondicons/Compose';
import Loading from 'icons/miscicons/Loading';

import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import Group from 'components/pricing/Group';
import Header from 'components/pricing/Header';
import Separator from 'components/pricing/Separator';

import LeaseTermsSelect from './LeaseTermsSelect';
import Rebates from './Rebates';
import Discount from './Discount';
import TaxesAndFees from '../../../../components/pricing/TaxesAndFees';

export default class LeasePane extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        dealPricing: PropTypes.object.isRequired,
    };

    state = {
        leaseTermsSelectOpened: false,
    };

    render() {
        const { dealPricing, onDiscountChange, onRebatesChange } = this.props;

        if (
            dealPricing.dealQuoteIsLoaded() &&
            (!dealPricing.leaseAnnualMileageAvailable() ||
                !dealPricing.leaseAnnualMileageAvailable().length)
        ) {
            return (
                <p>
                    Currently there are no competitive lease rates available on
                    this vehicle.
                </p>
            );
        }

        return (
            <div>
                <Group>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>{dealPricing.msrp()}</Value>
                    </Line>
                    <Discount
                        {...{ dealPricing }}
                        onChange={onDiscountChange}
                    />
                    <Line isSectionTotal={true}>
                        <Label>Discounted Price</Label>
                        <Value>{dealPricing.discountedPrice()}</Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                </Group>
                <Separator />
                <Group>
                    <Header>
                        Lease Terms
                        <Compose
                            style={{
                                float: 'right',
                                cursor: 'pointer',
                                fill: '#41b1ac',
                            }}
                            height="1em"
                            onClick={() => this.toggleTermsSelect()}
                        />
                    </Header>
                    {dealPricing.dealQuoteIsLoading() && <Loading />}
                    {dealPricing.dealQuoteIsLoading() || (
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
                                                {dealPricing.leaseAnnualMileage()}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    padding: '0 1em .25em',
                                                }}
                                            >
                                                {dealPricing.leaseTerm()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Line>
                            <Line>
                                <Label>Pre-Tax Payment</Label>
                                <Value>
                                    {dealPricing.leaseMonthlyPreTaxPayment()}
                                </Value>
                            </Line>
                            <Line>
                                <Label>Use Tax</Label>
                                <Value>
                                    {dealPricing.leaseMonthlyUseTax()}
                                </Value>
                            </Line>
                            <Line isImportant={true}>
                                <Label>Monthly Payment</Label>
                                <Value>{dealPricing.monthlyPayments()}</Value>
                            </Line>
                        </div>
                    )}
                </Group>
                <Separator />
                <Group>
                    <Header>Due at Delivery</Header>
                    <TaxesAndFees items={dealPricing.taxesAndFees()} />
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            ${dealPricing.leaseTotalAmountAtDriveOffValue()}
                        </Value>
                    </Line>
                </Group>
                {this.state.leaseTermsSelectOpened && (
                    <LeaseTermsSelect
                        dealPricing={dealPricing}
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

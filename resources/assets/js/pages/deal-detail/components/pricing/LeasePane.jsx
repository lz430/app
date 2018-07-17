import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import zondicons from 'zondicons';

import Rebates from './Rebates';
import Discount from './Discount';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import Group from './Group';
import Header from './Header';
import LeaseTermsSelect from './LeaseTermsSelect';
import Separator from './Separator';

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
                    <Header>Taxes &amp; Fees</Header>
                    <Line>
                        <Label>Total Taxes &amp; Fees</Label>
                        <Value>{dealPricing.taxesAndFeesTotal()}</Value>
                    </Line>
                    <Line isSectionTotal={true}>
                        <Label>Gross Capitalized Cost</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.grossCapitalizedCost()}
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    {dealPricing.hasRebatesApplied() || (
                        <Line>
                            <Label>No rebates available</Label>
                        </Line>
                    )}
                    {dealPricing.hasRebatesApplied() && (
                        <Line>
                            <Label>Applied</Label>
                            <Value
                                isNegative={true}
                                isLoading={dealPricing.dealQuoteIsLoading()}
                            >
                                {dealPricing.bestOffer()}
                            </Value>
                        </Line>
                    )}
                    <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                    <Line isSectionTotal={true}>
                        <Label>Net Capitalized Cost</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.netCapitalizedCost()}*
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>
                        Lease Terms
                        <SVGInline
                            style={{
                                float: 'right',
                                cursor: 'pointer',
                                fill: '#41b1ac',
                            }}
                            height="1em"
                            svg={zondicons['compose']}
                            onClick={this.handleShowLeaseTermsSelectClick}
                        />
                    </Header>
                    {dealPricing.dealQuoteIsLoading() && (
                        <SVGInline svg={miscicons['loading']} />
                    )}
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
                                    onClick={
                                        this.handleShowLeaseTermsSelectClick
                                    }
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
                            <Line isImportant={true}>
                                <Label>Monthly Payment</Label>
                                <Value>{dealPricing.monthlyPayments()}*</Value>
                            </Line>
                        </div>
                    )}
                </Group>
                {this.state.leaseTermsSelectOpened && (
                    <LeaseTermsSelect
                        {...{ dealPricing }}
                        onClose={this.handleLeaseTermsSelectClose}
                        onChange={this.handleLeaseTermsChange}
                    />
                )}
            </div>
        );
    }

    handleLeaseTermsChange = (annualMileage, term, cashDue) => {
        this.props.onChange(annualMileage, term, cashDue);

        this.handleLeaseTermsSelectClose();
    };

    handleTermChange = e => {
        const { dealPricing } = this.props;
        const term = e.target.value;

        this.props.onChange(
            dealPricing.leaseAnnualMileageValue(),
            term,
            dealPricing.leaseCashDueValue()
        );
    };

    handleAnnualMileageChange = e => {
        const { dealPricing } = this.props;
        const annualMileage = e.target.value;

        this.props.onChange(
            annualMileage,
            dealPricing.leaseTermValue(),
            dealPricing.leaseCashDueValue()
        );
    };

    handleLeaseTermsSelectClose = () => {
        this.setState({ leaseTermsSelectOpened: false });
    };

    handleShowLeaseTermsSelectClick = e => {
        e.preventDefault();

        this.openLeaseTermsSelect();
    };

    openLeaseTermsSelect = () => {
        this.setState({ leaseTermsSelectOpened: true });
    };
}

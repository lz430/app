import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

import Rebates from '../../containers/pricing/rebates/Rebates';
import Discount from './Discount';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import TaxesAndFees from './TaxesAndFees';
import Group from './Group';
import Header from './Header';
import LeaseTermsSelect from './LeaseTermsSelect';

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
                <hr />
                <Group>
                    <Header>Taxes &amp; Fees</Header>
                    {dealPricing.bestOfferIsLoading() && (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {dealPricing.bestOfferIsLoading() || (
                        <div>
                            <TaxesAndFees items={dealPricing.taxesAndFees()} />
                        </div>
                    )}
                    <Line isSectionTotal={true}>
                        <Label>Selling Price</Label>
                        <Value isLoading={dealPricing.bestOfferIsLoading()}>
                            {dealPricing.sellingPrice()}
                        </Value>
                    </Line>
                </Group>
                <hr />
                <Group>
                    <Header>Discounts</Header>
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={dealPricing.bestOfferIsLoading()}
                        >
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                    <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                    <Line isSectionTotal={true}>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={dealPricing.bestOfferIsLoading()}>
                            {dealPricing.yourPrice()}*
                        </Value>
                    </Line>
                </Group>
                <hr />
                <Group>
                    <Header>Lease Terms</Header>
                    {dealPricing.bestOfferIsLoading() && (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {dealPricing.bestOfferIsLoading() || (
                        <div>
                            <Line>
                                <Label>Annual Miles</Label>
                                <Value>
                                    <select
                                        onClick={
                                            this.handleUpdateLeaseTermsClick
                                        }
                                    >
                                        <option
                                            value={dealPricing.leaseAnnualMileageValue()}
                                        >
                                            {dealPricing.leaseAnnualMileageValue()}
                                        </option>
                                    </select>
                                </Value>
                            </Line>
                            <Line>
                                <Label>Term</Label>
                                <Value>
                                    <select
                                        onClick={
                                            this.handleUpdateLeaseTermsClick
                                        }
                                    >
                                        <option
                                            value={dealPricing.leaseTermValue()}
                                        >
                                            {dealPricing.leaseTermValue()}{' '}
                                            months
                                        </option>
                                    </select>
                                </Value>
                            </Line>
                            <Line>
                                <a
                                    style={{
                                        cursor: 'pointer',
                                        color: '#41b1ac',
                                        fontSize: '.75em',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={this.handleUpdateLeaseTermsClick}
                                >
                                    See all available lease options
                                </a>
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

    handleLeaseTermsSelectClose = () => {
        this.setState({ leaseTermsSelectOpened: false });
    };

    handleUpdateLeaseTermsClick = e => {
        e.preventDefault();
        e.target.blur();

        this.openLeaseTermsSelect();
    };

    openLeaseTermsSelect = () => {
        this.setState({ leaseTermsSelectOpened: true });
    };
}

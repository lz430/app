import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import strings from 'src/strings';
import DealImage from 'components/Deals/DealImage';
import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import Header from 'components/pricing/Header';
import Group from 'components/pricing/Group';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import Line from 'components/pricing/Line';
import Separator from 'components/pricing/Separator';
import TaxesAndFees from 'components/pricing/TaxesAndFees';
import { checkout } from 'apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from '../../components/Deals/DealStockNumber';

class CheckoutCompleteContainer extends React.PureComponent {
    static propTypes = {
        init: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.init();
    }

    render() {
        const { dealPricing } = this.props;
        const deal = dealPricing.deal();

        return (
            <Container className="checkout-confirm">
                <Row className="checkout-confirm__header">
                    <Col>
                        <h1>Congratulations on your new car!</h1>
                    </Col>
                </Row>

                <Row>
                    <Col className="image">
                        <DealImage deal={deal} link={false} />
                    </Col>
                    <Col className="title">
                        <Group>
                            <div className="year-and-make">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="model-and-trim">
                                {strings.dealModelTrim(deal)}
                            </div>
                            <div className="colors">
                                {strings.dealColors(deal)}
                            </div>
                            <div className="stock-number">
                                <DealStockNumber deal={deal} />
                            </div>
                        </Group>
                    </Col>
                    <Col className="summary">
                        {dealPricing.isCash() && (
                            <Group>
                                <Header style={{ fontSize: '1.5em' }}>
                                    Cash Summary
                                </Header>
                                <Line isImportant={true}>
                                    <Label>Cash Price</Label>
                                    <Value>{dealPricing.cashPrice()}</Value>
                                </Line>
                                <Line>
                                    <Label>Taxes &amp; Fees</Label>
                                    <Value>
                                        {dealPricing.taxesAndFeesTotal()}
                                    </Value>
                                </Line>
                            </Group>
                        )}
                        {dealPricing.isFinance() && (
                            <Group>
                                <Header style={{ fontSize: '1.5em' }}>
                                    Finance Summary
                                </Header>
                                <Line>
                                    <Label>Term</Label>
                                    <Value>
                                        {dealPricing.financeTerm()} months
                                    </Value>
                                </Line>
                                <Line isImportant={true}>
                                    <Label>Down Payment</Label>
                                    <Value>
                                        {dealPricing.financeDownPayment()}
                                    </Value>
                                </Line>
                                <Line isImportant={true}>
                                    <Label>Monthly Payment</Label>
                                    <Value>
                                        {dealPricing.monthlyPayments()}*
                                    </Value>
                                </Line>
                            </Group>
                        )}
                        {dealPricing.isLease() && (
                            <Group>
                                <Header style={{ fontSize: '1.5em' }}>
                                    Lease Summary
                                </Header>
                                <Line>
                                    <Label>Annual Miles</Label>
                                    <Value>
                                        {dealPricing.leaseAnnualMileage()}
                                    </Value>
                                </Line>
                                <Line>
                                    <Label>Term</Label>
                                    <Value>
                                        {dealPricing.leaseTerm()} months
                                    </Value>
                                </Line>
                                <Line isImportant={true}>
                                    <Label>Monthly Payment</Label>
                                    <Value>
                                        {dealPricing.monthlyPayments()}*
                                    </Value>
                                </Line>
                            </Group>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col className="details">
                        {dealPricing.isCash() && (
                            <div>
                                <Group>
                                    <Header style={{ fontSize: '1.5em' }}>
                                        Cash Details
                                    </Header>
                                    <Header>Price</Header>
                                    <Line>
                                        <Label>MSRP</Label>
                                        <Value>{dealPricing.msrp()}</Value>
                                    </Line>
                                    <Line>
                                        <Label>
                                            {dealPricing.isEffectiveDiscountDmr() &&
                                                'DMR Customer Discount'}
                                            {dealPricing.isEffectiveDiscountSupplier() &&
                                                'Supplier Discount'}
                                            {dealPricing.isEffectiveDiscountEmployee() &&
                                                'Employee Discount'}
                                        </Label>
                                        <Value isNegative={true}>
                                            {dealPricing.discount()}
                                        </Value>
                                    </Line>
                                    <Line isSectionTotal={true}>
                                        <Label>Discounted Price</Label>
                                        <Value>
                                            {dealPricing.discountedPrice()}
                                        </Value>
                                    </Line>
                                </Group>
                                <Separator />
                                <Group>
                                    <Header>Taxes &amp; Fees</Header>
                                    <TaxesAndFees
                                        items={dealPricing.taxesAndFees()}
                                    />
                                    <Line isSectionTotal={true}>
                                        <Label>Selling Price</Label>
                                        <Value>
                                            {dealPricing.sellingPrice()}*
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
                                    <Line
                                        isImportant={true}
                                        isSectionTotal={true}
                                    >
                                        <Label>Total Selling Price</Label>
                                        <Value
                                            isLoading={dealPricing.dealQuoteIsLoading()}
                                        >
                                            {dealPricing.yourPrice()}*
                                        </Value>
                                    </Line>
                                </Group>
                            </div>
                        )}
                        {dealPricing.isFinance() && (
                            <div>
                                <Group>
                                    <Header style={{ fontSize: '1.5em' }}>
                                        Finance Details
                                    </Header>
                                    <Header>Price</Header>
                                    <Line>
                                        <Label>MSRP</Label>
                                        <Value>{dealPricing.msrp()}</Value>
                                    </Line>
                                    <Line>
                                        <Label>
                                            {dealPricing.isEffectiveDiscountDmr() &&
                                                'DMR Customer Discount'}
                                            {dealPricing.isEffectiveDiscountSupplier() &&
                                                'Supplier Discount'}
                                            {dealPricing.isEffectiveDiscountEmployee() &&
                                                'Employee Discount'}
                                        </Label>
                                        <Value isNegative={true}>
                                            {dealPricing.discount()}
                                        </Value>
                                    </Line>
                                    <Line isSectionTotal={true}>
                                        <Label>Discounted Price</Label>
                                        <Value>
                                            {dealPricing.discountedPrice()}
                                        </Value>
                                    </Line>
                                </Group>
                                <Separator />
                                <Group>
                                    <Header>Taxes &amp; Fees</Header>
                                    <TaxesAndFees
                                        items={dealPricing.taxesAndFees()}
                                    />
                                    <Line isSectionTotal={true}>
                                        <Label>Selling Price</Label>
                                        <Value>
                                            {dealPricing.sellingPrice()}*
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
                                    <Line isSectionTotal={true}>
                                        <Label>Total Selling Price</Label>
                                        <Value
                                            isLoading={dealPricing.dealQuoteIsLoading()}
                                        >
                                            {dealPricing.yourPrice()}*
                                        </Value>
                                    </Line>
                                </Group>
                                <Separator />
                                <Group
                                    isLoading={dealPricing.dealQuoteIsLoading()}
                                >
                                    <Header>Finance Terms</Header>
                                    {dealPricing.dealQuoteIsLoading() && (
                                        <SVGInline svg={miscicons['loading']} />
                                    )}
                                    {dealPricing.dealQuoteIsLoading() || (
                                        <div>
                                            <Line isSemiImportant={true}>
                                                <Label>Down Payment</Label>
                                                <Value isNegative={true}>
                                                    {dealPricing.financeDownPayment()}
                                                </Value>
                                            </Line>
                                            <Line>
                                                <Label>Amount Financed</Label>
                                                <Value>
                                                    {dealPricing.amountFinanced()}*
                                                </Value>
                                            </Line>
                                        </div>
                                    )}
                                </Group>
                            </div>
                        )}
                        {dealPricing.isLease() && (
                            <div>
                                <Group>
                                    <Header style={{ fontSize: '1.5em' }}>
                                        Lease Details
                                    </Header>
                                    <Header>Price</Header>
                                    <Line>
                                        <Label>MSRP</Label>
                                        <Value>{dealPricing.msrp()}</Value>
                                    </Line>
                                    <Line>
                                        <Label>
                                            {dealPricing.isEffectiveDiscountDmr() &&
                                                'DMR Customer Discount'}
                                            {dealPricing.isEffectiveDiscountSupplier() &&
                                                'Supplier Discount'}
                                            {dealPricing.isEffectiveDiscountEmployee() &&
                                                'Employee Discount'}
                                        </Label>
                                        <Value isNegative={true}>
                                            {dealPricing.discount()}
                                        </Value>
                                    </Line>
                                    <Line isSectionTotal={true}>
                                        <Label>Discounted Price</Label>
                                        <Value>
                                            {dealPricing.discountedPrice()}
                                        </Value>
                                    </Line>
                                </Group>
                                <Separator />
                                <Group>
                                    <Header>Taxes &amp; Fees</Header>
                                    <TaxesAndFees
                                        items={dealPricing.taxesAndFees()}
                                    />
                                    <Line isSectionTotal={true}>
                                        <Label>Gross Capitalized Cost</Label>
                                        <Value
                                            isLoading={dealPricing.dealQuoteIsLoading()}
                                        >
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
                                    <Line isSectionTotal={true}>
                                        <Label>Net Capitalized Cost</Label>
                                        <Value
                                            isLoading={dealPricing.dealQuoteIsLoading()}
                                        >
                                            {dealPricing.netCapitalizedCost()}*
                                        </Value>
                                    </Line>
                                </Group>
                            </div>
                        )}
                    </Col>
                    <Col className="confirm">
                        <Group>
                            <Header style={{ fontSize: '1.5em' }}>
                                What's next?
                            </Header>
                            <p>
                                A Deliver My Ride affiliate dealer
                                representative will contact you shortly to
                                schedule your delivery. If past regular hours of
                                operation, you can expect a call early the next
                                business day.
                            </p>

                            <Header>
                                To finalize your purchase, you'll need:
                            </Header>
                            <ul>
                                <li>Drivers License</li>
                                <li>Certificate of Insurance</li>
                                <li>
                                    Certified Check in the amount listed above
                                </li>
                                <li>Registration</li>
                                <li>
                                    Proof of eligibility for any rebates you
                                    selected
                                </li>
                            </ul>
                        </Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ margin: '1em 0' }}>
                            * This is not a binding contract. Delivering dealer
                            will verify vehicle availability, pricing details
                            and incentive eligibility. Rates are subject to
                            credit approval.
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        dealPricing: dealPricingFromCheckoutFactory(state, props),
        checkout: checkout(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    init,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutCompleteContainer);

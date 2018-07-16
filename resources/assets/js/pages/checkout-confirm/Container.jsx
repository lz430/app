import React from 'react';
import { connect } from 'react-redux';

import strings from 'src/strings';
import DealImage from 'components/Deals/DealImage';
import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import { getUserLocation } from 'apps/user/selectors';
import { checkoutStart } from 'apps/checkout/actions';
import mapAndBindActionCreators from '../../util/mapAndBindActionCreators';
import Header from '../../components/pricing/Header';
import Group from '../../components/pricing/Group';
import Label from '../../components/pricing/Label';
import Value from '../../components/pricing/Value';
import Line from '../../components/pricing/Line';
import Separator from '../../components/pricing/Separator';
import TaxesAndFees from '../../components/pricing/TaxesAndFees';

class Container extends React.PureComponent {
    handleConfirmPurchase = e => {
        this.props.checkoutStart(this.props.dealPricing);
    };

    render() {
        const { dealPricing } = this.props;
        const deal = dealPricing.deal();

        return (
            <div className="checkout-confirm">
                <h1>Say hello to your new car!</h1>
                <div className="container">
                    <div className="row">
                        <div className="image">
                            <DealImage deal={deal} />
                        </div>
                        <div className="title">
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
                                    Stock# {deal.stock_number}
                                </div>
                            </Group>
                        </div>
                        <div className="summary">
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
                                    <Line isSemiImportant={true}>
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
                        </div>
                    </div>
                    <div className="row">
                        <div className="details">
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
                                                <Label>
                                                    No rebates available
                                                </Label>
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
                                                <Label>
                                                    No rebates available
                                                </Label>
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
                                            <SVGInline
                                                svg={miscicons['loading']}
                                            />
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
                                                    <Label>
                                                        Amount Financed
                                                    </Label>
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
                                            <Label>
                                                Gross Capitalized Cost
                                            </Label>
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
                                                <Label>
                                                    No rebates available
                                                </Label>
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
                        </div>
                        <div className="confirm">
                            <Group>
                                <Header style={{ fontSize: '1.5em' }}>
                                    Confirm your purchase
                                </Header>

                                <form
                                    className="request-email__form"
                                    method="POST"
                                    action="/receive-email"
                                    onSubmit={this.handleConfirmPurchase}
                                >
                                    <div className="request-email__group">
                                        <label
                                            htmlFor="email"
                                            className="request-email__label"
                                        >
                                            Email
                                        </label>

                                        <div className="request-email__input-and-error">
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Enter Your Email"
                                                className="request-email__input"
                                                name="email"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="request-email__group">
                                        <label
                                            htmlFor="first_name"
                                            className="request-email__label"
                                        >
                                            First Name
                                        </label>

                                        <div className="request-email__input-and-error">
                                            <input
                                                id="first_name"
                                                type="text"
                                                className="request-email__input"
                                                placeholder="Enter Your First Name"
                                                name="first_name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="request-email__group">
                                        <label
                                            htmlFor="last_name"
                                            className="request-email__label"
                                        >
                                            Last Name
                                        </label>

                                        <div className="request-email__input-and-error">
                                            <input
                                                id="last_name"
                                                type="text"
                                                className="request-email__input"
                                                name="last_name"
                                                placeholder="Enter Your Last Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="request-email__group">
                                        <label
                                            htmlFor="phone_number"
                                            className="request-email__label"
                                        >
                                            Phone Number
                                        </label>

                                        <div className="request-email__input-and-error">
                                            <input
                                                id="phone_number"
                                                type="tel"
                                                className="request-email__input"
                                                name="phone_number"
                                                placeholder="Enter Your Phone Number"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="request-dl__group">
                                        <div className="request-dl__labels">
                                            <label
                                                htmlFor="drivers_license"
                                                type="text"
                                                className="request-dl__number-label"
                                            >
                                                Driver's License Number
                                            </label>
                                            <label
                                                htmlFor="drivers_license_state"
                                                className="request-dl__state-label"
                                            >
                                                State
                                            </label>
                                        </div>

                                        <div className="request-dl__inline-input-and-error">
                                            <input
                                                id="drivers_license"
                                                className="request-dl__number"
                                                name="drivers_license_number"
                                                placeholder="Enter Driver's License Number"
                                                required
                                            />

                                            <select
                                                className="request-dl__state"
                                                id="drivers_license_state"
                                                name="drivers_license_state"
                                            >
                                                <option value="AL">AL</option>
                                                <option value="AK">AK</option>
                                                <option value="AS">AS</option>
                                                <option value="AZ">AZ</option>
                                                <option value="AR">AR</option>
                                                <option value="CA">CA</option>
                                                <option value="CO">CO</option>
                                                <option value="CT">CT</option>
                                                <option value="DE">DE</option>
                                                <option value="DC">DC</option>
                                                <option value="FM">FM</option>
                                                <option value="FL">FL</option>
                                                <option value="GA">GA</option>
                                                <option value="GU">GU</option>
                                                <option value="HI">HI</option>
                                                <option value="ID">ID</option>
                                                <option value="IL">IL</option>
                                                <option value="IN">IN</option>
                                                <option value="IA">IA</option>
                                                <option value="KS">KS</option>
                                                <option value="KY">KY</option>
                                                <option value="LA">LA</option>
                                                <option value="ME">ME</option>
                                                <option value="MH">MH</option>
                                                <option value="MD">MD</option>
                                                <option value="MA">MA</option>
                                                <option value="MI">MI</option>
                                                <option value="MN">MN</option>
                                                <option value="MS">MS</option>
                                                <option value="MO">MO</option>
                                                <option value="MT">MT</option>
                                                <option value="NE">NE</option>
                                                <option value="NV">NV</option>
                                                <option value="NH">NH</option>
                                                <option value="NJ">NJ</option>
                                                <option value="NM">NM</option>
                                                <option value="NY">NY</option>
                                                <option value="NC">NC</option>
                                                <option value="ND">ND</option>
                                                <option value="MP">MP</option>
                                                <option value="OH">OH</option>
                                                <option value="OK">OK</option>
                                                <option value="OR">OR</option>
                                                <option value="PW">PW</option>
                                                <option value="PA">PA</option>
                                                <option value="PR">PR</option>
                                                <option value="RI">RI</option>
                                                <option value="SC">SC</option>
                                                <option value="SD">SD</option>
                                                <option value="TN">TN</option>
                                                <option value="TX">TX</option>
                                                <option value="UT">UT</option>
                                                <option value="VT">VT</option>
                                                <option value="VI">VI</option>
                                                <option value="VA">VA</option>
                                                <option value="WA">WA</option>
                                                <option value="WV">WV</option>
                                                <option value="WI">WI</option>
                                                <option value="WY">WY</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="request-email__captcha" />

                                    <input type="hidden" name="method" />
                                    <div className="request-email__buttons">
                                        <button className="request-email__button request-email__button--purple request-email__button--small">
                                            Confirm and Submit
                                        </button>
                                    </div>
                                </form>
                            </Group>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '1em 0' }}>
                    * This is not a binding contract. The figures presented are
                    based upon estimates. Rates subject to credit approval.
                    After confirming this purchase, we will finalize financing
                    and delivery details.
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        dealPricing: dealPricingFromCheckoutFactory(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    checkoutStart,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);

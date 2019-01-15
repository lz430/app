import Pricing from './Pricing';
import { zero } from '../money';

export default class CashPricing extends Pricing {
    basePrice = () =>
        this.discountedPrice()
            .add(this.tradeIn().owed)
            .subtract(this.tradeIn().value);
    sellingPrice = () => this.withTaxAdded(this.basePrice());
    yourPrice = () => this.basePrice().subtract(this.rebates());

    salesTax = () => this.discountedPrice().multiply(this.taxRate());

    taxesAndFees = () =>
        zero
            .add(this.docFeeWithTaxes())
            .add(this.cvrFeeWithTaxes())
            .add(this.salesTax());

    totalPrice = () =>
        this.discountedPrice()
            .subtract(this.rebates())
            .add(this.taxesAndFees());
    //this.yourPrice().add(this.taxesAndFees());
}

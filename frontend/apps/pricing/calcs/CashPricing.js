import Pricing from './Pricing';
import { zero } from '../money';

export default class CashPricing extends Pricing {
    basePrice = () =>
        this.discountedPrice()
            .add(this.tradeIn().owed)
            .subtract(this.tradeIn().value);
    sellingPrice = () => this.withTaxAdded(this.basePrice());
    yourPrice = () => this.basePrice().subtract(this.rebates());

    salesTax = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee())
            .multiply(this.taxRate());

    taxesAndFees = () =>
        zero
            .add(this.docFee())
            .add(this.cvrFee())
            .add(this.salesTax());

    totalPrice = () => this.yourPrice().add(this.taxesAndFees());
}

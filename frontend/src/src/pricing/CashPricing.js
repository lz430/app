import Pricing from './Pricing';
import { zero } from '../money';

export default class CashPricing extends Pricing {
    salesTax = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee())
            .multiply(this.taxRate());

    sellingPrice = () => this.discountedPrice().add(this.taxesAndFees());

    taxesAndFees = () =>
        zero
            .add(this.docFee())
            .add(this.cvrFee())
            .add(this.salesTax());

    yourPrice = () => this.sellingPrice().subtract(this.rebates());
    cashPrice = () => this.discountedPrice().subtract(this.rebates());
}

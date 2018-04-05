import formulas from 'src/formulas';
import util from 'src/util';
import R from "ramda";
import Decimal from "decimal.js";

export default class DealPricing {
    constructor(data) {
        this.data = data;
    }

    update(data) {
        this.data = data;
    }

    bestOffersIsLoading() {
        return this.data.bestOffersIsLoading;
    }

    deal() {
        return this.data.deal;
    }

    financeDownPaymentValue() {
        return this.data.financeDownPayment === null ? this.yourPriceValue() * .10 : this.data.financeDownPayment;
    }

    financeDownPayment() {
        return util.moneyFormat(this.financeDownPaymentValue());
    }

    financeTermValue() {
        return this.data.financeTerm === null ? 60 : this.data.financeTerm;
    }

    financeTerm() {
        return this.financeTermValue();
    }

    leaseTermValue() {
        return this.data.leaseTerm === null ? 36 : this.data.leaseTerm;
    }

    leaseTerm() {
        return this.leaseTermValue();
    }

    leaseAnnualMileageValue() {
        return this.data.leaseAnnualMileage === null ? 10000 : this.data.leaseAnnualMileage;
    }

    leaseAnnualMileage() {
        return this.leaseAnnualMileageValue();
    }

    leaseResidualPercentValue() {
        return this.data.leaseResidualPercent;
    }

    leaseResidualPercent() {
        return this.leaseResidualPercentValue();
    }

    msrp() {
        return util.moneyFormat(this.data.deal.msrp);
    }

    docFeeValue() {
        return this.data.deal.doc_fee;
    }

    docFee() {
        return util.moneyFormat(this.docFeeValue());
    }

    effCvrFeeValue() {
        return 24;
    }

    licenseAndRegistrationValue() {
        return 23;
    }

    taxRate() {
        return 0.06;
    }

    acquisitionFee() {
        return 640;
    }

    bestOfferValue() {
        return this.data.bestOffer.totalValue || 0;
    }

    bestOffer() {
        return util.moneyFormat(this.bestOfferValue());
    }

    baseSellingPriceValue() {
        return this.data.employeeBrand === this.data.deal.make
            ? this.data.deal.employee_price
            : this.data.deal.supplier_price;
    }

    baseSellingPrice() {
        return util.moneyFormat(this.baseSellingPriceValue());
    }

    sellingPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                const total = new Decimal(this.baseSellingPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue());

                const totalWithSalesTax = total.plus(total.times(this.taxRate()));

                return Number(totalWithSalesTax.plus(this.licenseAndRegistrationValue()));
            case 'lease':
                return new Decimal(this.baseSellingPriceValue())
                    .plus(this.docFeeValue())
                    .plus(new Decimal(this.docFeeValue()).times(this.taxRate()))
                    .plus(this.effCvrFeeValue())
                    .plus(new Decimal(this.effCvrFeeValue()).times(this.taxRate()))
                    .plus(this.licenseAndRegistrationValue())
                    .plus(this.acquisitionFee());
        }
    }

    sellingPrice() {
        return util.moneyFormat(this.sellingPriceValue());
    }

    yourPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                return new Decimal(this.sellingPriceValue())
                    .minus(this.bestOfferValue());
            case 'lease':
                return new Decimal(this.sellingPriceValue())
                    .minus(this.bestOfferValue());
        }
    }

    yourPrice() {
        return util.moneyFormat(this.yourPriceValue());
    }

    /*
    yourPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
                return formulas.calculateTotalCash(
                    this.baseSellingPriceValue(),
                    this.docFeeValue(),
                    this.bestOfferValue()
                );
            case 'finance':
                return formulas.calculateTotalCashFinance(
                    this.baseSellingPriceValue(),
                    this.docFeeValue(),
                    this.financeDownPaymentValue(),
                    this.bestOfferValue()
                );
            case 'lease':
                return formulas.calculateTotalLease(
                    this.baseSellingPriceValue(),
                    this.docFeeValue(),
                    this.bestOfferValue()
                )
        }
    }

    yourPrice() {
        return util.moneyFormat(this.yourPriceValue());
    }
    */

    finalPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
                return this.yourPriceValue();
            case 'finance':
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        this.baseSellingPriceValue() - this.bestOfferValue(),
                        this.financeDownPaymentValue(),
                        this.financeTermValue()
                    )
                );
            case 'lease':
                return formulas.calculateTotalLeaseMonthlyPayment(
                    formulas.calculateLeasedMonthlyPayments(
                        this.baseSellingPriceValue() - this.bestOfferValue(),
                        0,
                        0,
                        this.leaseTerm(),
                        R.or(this.leaseResidualPercent(), 31)
                    )
                );
        }
    }

    finalPrice() {
        return util.moneyFormat(this.finalPriceValue());
    }
}
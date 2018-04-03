import formulas from 'src/formulas';
import util from 'src/util';
import R from "ramda";

export default class DealPricing {
    constructor({
                    deal,
                    bestOffer,
                    bestOffersIsLoading,
                    zipcode,
                    paymentType,
                    employeeBrand,
                    financeDownPayment,
                    financeTerm,
                    leaseAnnualMiles,
                    leaseTerm,
                    leaseResidualPercent
                } = {}) {
        this._deal = deal;
        this._bestOffer = bestOffer;
        this._bestOffersIsLoading = bestOffersIsLoading;
        this._zipcode = zipcode;
        this._paymentType = paymentType;
        this._employeeBrand = employeeBrand;
        this._financeDownPayment = financeDownPayment;
        this._financeTerm = financeTerm;
        this._leaseAnnualMiles = leaseAnnualMiles;
        this._leaseTerm = leaseTerm;
        this._leaseResidualPercent = leaseResidualPercent;
    }

    bestOffersIsLoading() {
        return this._bestOffersIsLoading;
    }

    deal() {
        return this._deal;
    }

    financeDownPaymentValue() {
        return this._financeDownPayment;
    }

    financeDownPayment() {
        return util.moneyFormat(this.financeDownPaymentValue());
    }

    financeTermValue() {
        return this._financeTerm;
    }

    financeTerm() {
        return this.financeTermValue();
    }

    leaseTermValue() {
        return this._leaseTerm;
    }

    leaseTerm() {
        return this.leaseTermValue();
    }

    leaseResidualPercentValue() {
        return this._leaseResidualPercent;
    }

    leaseResidualPercent() {
        return this.leaseResidualPercentValue();
    }

    msrp() {
        return util.moneyFormat(this._deal.msrp);
    }

    docFeeValue() {
        return this._deal.doc_fee;
    }

    docFee() {
        return util.moneyFormat(this.docFeeValue());
    }

    bestOfferValue() {
        return this._bestOffer.totalValue || 0;
    }

    bestOffer() {
        return util.moneyFormat(this.bestOfferValue());
    }

    basePriceValue() {
        return util.getEmployeeOrSupplierPrice(this._deal, this._employeeBrand);
    }

    basePrice() {
        return util.moneyFormat(this.basePriceValue());
    }

    yourPriceValue() {
        switch (this._paymentType) {
            case 'cash':
                return formulas.calculateTotalCash(
                    this.basePriceValue(),
                    this.docFeeValue(),
                    this.bestOfferValue()
                );
            case 'finance':
                return formulas.calculateTotalCashFinance(
                    this.basePriceValue(),
                    this.docFeeValue(),
                    this.financeDownPaymentValue(),
                    this.bestOfferValue()
                );
            case 'lease':
                return formulas.calculateTotalLease(
                    this.basePriceValue(),
                    this.docFeeValue(),
                    this.bestOfferValue()
                )
        }
    }

    yourPrice() {
        return util.moneyFormat(this.yourPriceValue());
    }

    finalPriceValue() {
        switch (this._paymentType) {
            case 'cash':
                return formulas.calculateTotalCash(
                    this.basePriceValue(),
                    this.docFeeValue(),
                    this.bestOfferValue()
                );
            case 'finance':
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        this.basePriceValue() - this.bestOfferValue(),
                        this.financeDownPaymentValue(),
                        this.financeTermValue()
                    )
                );
            case 'lease':
                return formulas.calculateTotalLeaseMonthlyPayment(
                    formulas.calculateLeasedMonthlyPayments(
                        this.basePriceValue() - this.bestOfferValue(),
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
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

    id() {
        return this.data.deal.id;
    }

    jatoVehicleId() {
        return this.data.deal.version.jato_vehicle_id;
    }

    allCashDownOptions() {
        return [0, 500, 1000, 2500, 5000];
    }

    bestOfferIsLoading() {
        return this.data.bestOfferIsLoading;
    }

    deal() {
        return this.data.deal;
    }

    hasCustomizedQuote() {
        return this.data.dealHasCustomizedQuote;
    }

    financeDownPaymentValue() {
        return this.data.financeDownPayment === null ?
            (new Decimal(this.yourPriceValue() * .10).toFixed(2)) :
            this.data.financeDownPayment;
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
        if (! this.data.leaseTerm) {
            const leaseTermsAvailable = this.leaseTermsAvailable();

            if (! leaseTermsAvailable || leaseTermsAvailable.length === 0) {
                return null;
            }

            if (leaseTermsAvailable.includes(36)) {
                return 36;
            }

            // Return the first lease terms available.
            return leaseTermsAvailable[0];
        }

        return this.data.leaseTerm;
    }

    leaseTerm() {
        return this.leaseTermValue();
    }

    leaseCashDownValue() {
        return this.data.leaseCashDown === null ? 500 : this.data.leaseCashDown;
    }

    leaseCashDown() {
        return util.moneyFormat(this.leaseCashDownValue());
    }

    leaseAnnualMileageValue() {
        if (! this.data.leaseAnnualMileage) {
            const leaseAnnualMileageAvailable = this.leaseAnnualMileageAvailable();

            if (! leaseAnnualMileageAvailable || leaseAnnualMileageAvailable.length === 0) {
                return null;
            }

            if (leaseAnnualMileageAvailable.includes(10000)) {
                return 10000;
            }

            // Return the first lease annual mileages available.
            return leaseAnnualMileageAvailable[0];
        }

        return this.data.leaseAnnualMileage;
    }

    leaseAnnualMileage() {
        return this.leaseAnnualMileageValue();
    }

    msrpValue() {
        return this.data.deal.msrp;
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
        return this.data.deal.cvr_fee;
    }

    licenseAndRegistrationValue() {
        return this.data.deal.registration_fee;
    }

    taxRate() {
        return 0.06;
    }

    acquisitionFeeValue() {
        return this.data.deal.acquisition_fee;
    }

    bestOfferValue() {
        return this.data.bestOffer.totalValue || 0;
    }

    bestOffer() {
        return util.moneyFormat(this.bestOfferValue());
    }

    employeeBrand() {
        return this.data.employeeBrand;
    }

    baseSellingPriceValue() {
        return this.data.employeeBrand === this.data.deal.make
            ? this.data.deal.employee_price
            : this.data.deal.supplier_price;
    }

    baseSellingPrice() {
        return util.moneyFormat(this.baseSellingPriceValue());
    }

    isLease() {
        return this.data.paymentType === 'lease';
    }

    isNotLease() {
        return this.data.paymentType !== 'lease';
    }

    hasNoLeaseTerms() {
        return ! this.data.dealLeaseRates || this.data.dealLeaseRates.length === 0;
    }

    hasLeaseTerms() {
        return ! this.hasNoLeaseTerms();
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
                    .plus(this.acquisitionFeeValue())
                    .toFixed(2);
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

    finalPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
                return this.yourPriceValue();
            case 'finance':
            case 'lease':
                return this.monthlyPaymentsValue();
        }
    }

    finalPrice() {
        const price = this.finalPriceValue();

        return price ? util.moneyFormat(price) : null;
    }

    monthlyPaymentsValue() {
        switch (this.data.paymentType) {
            case 'finance':
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        this.baseSellingPriceValue() - this.bestOfferValue(),
                        this.financeDownPaymentValue(),
                        this.financeTermValue()
                    )
                );
            case 'lease':
                return this.leaseMonthlyPaymentsValue();
        }
    }

    leaseMonthlyPaymentsValue() {
        if (! this.data.dealLeasePayments) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()]) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()]) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()][this.leaseAnnualMileageValue()]) {
            return null;
        }

        return this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()][this.leaseAnnualMileageValue()].monthlyPayment;
    }

    leaseTermsAvailable() {
        if (! this.data.dealLeasePayments) {
            return null;
        }

        return Object.keys(this.data.dealLeasePayments).map((item) => parseInt(item, 10)).sort((a, b) => a - b);
    }

    leaseCashDownAvailable() {
        if (! this.data.dealLeasePayments) {
            return null;
        }

        const cashDownOptions = [];

        for (let term of Object.keys(this.data.dealLeasePayments)) {
            for (let cashDown of Object.keys(this.data.dealLeasePayments[term])) {
                if (R.indexOf(cashDown, cashDownOptions) !== -1) {
                    continue;
                }

                cashDownOptions.push(cashDown);
            }
        }

        return cashDownOptions.map((item) => parseInt(item, 10));
    }

    leaseAnnualMileageAvailable() {
        if (! this.data.dealLeasePayments) {
            return null;
        }

        const annualMileageOptions = [];

        for (let term of Object.keys(this.data.dealLeasePayments)) {
            for (let cashDown of Object.keys(this.data.dealLeasePayments[term])) {

                for (let annualMileage of Object.keys(this.data.dealLeasePayments[term][cashDown])) {
                    if (R.indexOf(annualMileage, annualMileageOptions) !== -1) {
                        continue;
                    }

                    annualMileageOptions.push(annualMileage);
                }
            }
        }

        return annualMileageOptions.map((item) => parseInt(item, 10)).sort((a, b) => a - b);
    }

    leasePaymentsForTermAndCashDownValue(term, cashDown) {
        if (! this.data.dealLeasePayments[term]) {
            return null;
        }

        if (! this.data.dealLeasePayments[term][cashDown]) {
            return null;
        }

        if (! this.data.dealLeasePayments[term][cashDown][this.leaseAnnualMileageValue()]) {
            return null;
        }

        return this.data.dealLeasePayments[term][cashDown][this.leaseAnnualMileageValue()].monthlyPayment;
    }

    leasePaymentsForTermAndCashDown(term, cashDown) {
        const payment = this.leasePaymentsForTermAndCashDownValue(term, cashDown);

        return payment ? util.moneyFormat(payment) : null;
    }

    isSelectedLeasePaymentForTermAndCashDown(term, cashDown) {
        if (term != this.leaseTermValue()) {
            return false;
        }

        if (cashDown != this.leaseCashDownValue()) {
            return false;
        }

        return true;
    }

    leaseTotalAmountAtDriveOffValue() {
        if (! this.data.dealLeasePayments) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()]) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()]) {
            return null;
        }

        if (! this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()][this.leaseAnnualMileageValue()]) {
            return null;
        }

        return this.data.dealLeasePayments[this.leaseTerm()][this.leaseCashDownValue()][this.leaseAnnualMileageValue()].cashDown;
    }

    leaseTotalAmountAtDriveOff() {
        const total = this.leaseTotalAmountAtDriveOffValue();

        return total ? util.moneyFormat(total) : null;
    }

    monthlyPayments() {
        const monthlyPayments = this.monthlyPaymentsValue();

        return monthlyPayments ? util.moneyFormat(monthlyPayments) : null;
    }

    amountFinancedValue() {
        switch (this.data.paymentType) {
            case 'finance':
                return this.yourPriceValue() - this.financeDownPaymentValue();
        }
    }

    amountFinanced() {
        return util.moneyFormat(this.amountFinancedValue());
    }

    apiTerms() {
        const terms = {};

        for (let termRaw of this.data.dealLeaseRates) {
            const termData = {
                moneyFactor: termRaw.moneyFactor,
                residualPercent: termRaw.residualPercent,
                annualMileage: {}
            };

            for (let residuals of termRaw.residuals) {
                termData.annualMileage[residuals.annualMileage] = {
                    residualPercent: residuals.residualPercent
                };
            }

            terms[termRaw.termMonths] = termData;
        }

        return terms;
    }

    isPricingLoading() {
        return ! this.isPricingAvailable();
    }

    isPricingAvailable() {
        if (this.bestOfferIsLoading()) {
            return false;
        }

        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                return true;
            case 'lease':
                if (this.data.dealLeaseRatesLoaded && this.data.dealLeaseRates.length === 0) {
                    // If rates are loaded but there are no actual rates, then pricing is "available"
                    // in that there is no lease pricing ever going to be available.
                    return true;
                }

                return this.data.dealLeasePaymentsLoaded;
        }
    }

    canPurchase() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                return this.isPricingAvailable();
            case 'lease':
                return this.canLease();
        }
    }

    canLease() {
        if (this.isPricingLoading()) {
            return false;
        }

        return this.hasLeaseTerms();
    }
}
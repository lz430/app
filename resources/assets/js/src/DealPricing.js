import formulas from 'src/formulas';
import util from 'src/util';
import R from 'ramda';
import Decimal from 'decimal.js';

export default class DealPricing {
    constructor(data) {
        console.log(data);
        this.data = data;
    }

    id() {
        return this.data.deal.id;
    }

    vin() {
        return this.data.deal.vin;
    }

    paymentType() {
        return this.data.paymentType;
    }

    make() {
        return this.data.deal.make;
    }

    zipcode() {
        return this.data.zipcode;
    }

    allLeaseCashDueOptions() {
        return [0];
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
        let value = this.data.financeDownPayment;

        if (value === null || value === undefined) {
            value = new Decimal(this.yourPriceValue() * 0.1).toFixed(2);
        }

        return value;
    }

    financeDownPayment() {
        return util.moneyFormat(this.financeDownPaymentValue());
    }

    financeTermValue() {
        let value = this.data.financeTerm;
        if (value === null || value === undefined) {
            value = 60;
        }
        return value;
    }

    financeTerm() {
        return this.financeTermValue();
    }

    leaseTermValue() {
        if (!this.data.leaseTerm) {
            const leaseTermsAvailable = this.leaseTermsAvailable();

            if (!leaseTermsAvailable || leaseTermsAvailable.length === 0) {
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

    leaseCashDueValue() {
        return 0;
    }

    leaseCashDue() {
        return util.moneyFormat(this.leaseCashDueValue());
    }

    leaseAnnualMileageValue() {
        if (!this.data.leaseAnnualMileage) {
            const leaseAnnualMileageAvailable = this.leaseAnnualMileageAvailable();

            if (
                !leaseAnnualMileageAvailable ||
                leaseAnnualMileageAvailable.length === 0
            ) {
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
        return this.data.deal.pricing.msrp;
    }

    msrp() {
        return util.moneyFormat(this.msrpValue());
    }

    defaultPriceValue() {
        return this.data.deal.pricing.default;
    }

    defaultPrice() {
        return util.moneyFormat(this.defaultPriceValue());
    }

    employeePriceValue() {
        return this.data.deal.pricing.employee;
    }

    employeePrice() {
        return util.moneyFormat(this.employeePriceValue());
    }

    supplierPriceValue() {
        return this.data.deal.pricing.supplier;
    }

    supplierPrice() {
        return util.moneyFormat(this.supplierPriceValue());
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

    bestOfferPrograms() {
        return this.data.bestOffer.programs;
    }

    employeeBrand() {
        return this.data.employeeBrand;
    }

    supplierBrand() {
        return this.data.supplierBrand;
    }

    baseSellingPriceValue() {
        if (this.isEffectiveDiscountEmployee()) {
            return this.employeePriceValue();
        }

        if (this.isEffectiveDiscountSupplier()) {
            return this.supplierPriceValue();
        }

        if (this.isEffectiveDiscountDmr()) {
            return this.defaultPriceValue();
        }

        return this.msrpValue();
    }

    baseSellingPrice() {
        return util.moneyFormat(this.baseSellingPriceValue());
    }

    dmrDiscountValue() {
        return this.msrpValue() - this.defaultPriceValue();
    }

    dmrDiscount() {
        return util.moneyFormat(this.dmrDiscountValue());
    }

    employeeDiscountValue() {
        return this.msrpValue() - this.employeePriceValue();
    }

    employeeDiscount() {
        return util.moneyFormat(this.employeeDiscountValue());
    }

    supplierDiscountValue() {
        return this.msrpValue() - this.supplierPriceValue();
    }

    supplierDiscount() {
        return util.moneyFormat(this.supplierDiscountValue());
    }

    isEffectiveDiscountEmployee() {
        return (
            this.data.discountType === 'employee' &&
            this.data.employeeBrand === this.data.deal.make
        );
    }

    isEffectiveDiscountSupplier() {
        return (
            this.data.discountType === 'supplier' &&
            this.data.supplierBrand === this.data.deal.make
        );
    }

    isEffectiveDiscountDmr() {
        if (!this.data.discountType) {
            return true;
        }

        if (
            this.data.discountType === 'employee' &&
            this.data.employeeBrand !== this.data.deal.make
        ) {
            return true;
        }

        if (
            this.data.discountType === 'supplier' &&
            this.data.supplierBrand !== this.data.deal.make
        ) {
            return true;
        }

        return this.data.discountType === 'dmr';
    }

    isFinance() {
        return this.data.paymentType === 'finance';
    }

    isLease() {
        return this.data.paymentType === 'lease';
    }

    isNotLease() {
        return this.data.paymentType !== 'lease';
    }

    sellingPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                const total = new Decimal(this.baseSellingPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue());

                const totalWithSalesTax = total.plus(
                    total.times(this.taxRate())
                );

                return Number(
                    totalWithSalesTax.plus(this.licenseAndRegistrationValue())
                );
            case 'lease':
                return new Decimal(this.baseSellingPriceValue()).toFixed(2);
            /*return new Decimal(this.baseSellingPriceValue())
                    .plus(this.docFeeValue())
                    .plus(new Decimal(this.docFeeValue()).times(this.taxRate()))
                    .plus(this.effCvrFeeValue())
                    .plus(
                        new Decimal(this.effCvrFeeValue()).times(this.taxRate())
                    )
                    .plus(this.licenseAndRegistrationValue())
                    .plus(this.acquisitionFeeValue())
                    .toFixed(2);*/
        }
    }

    sellingPrice() {
        return util.moneyFormat(this.sellingPriceValue());
    }

    yourPriceValue() {
        return new Decimal(this.sellingPriceValue()).minus(
            this.bestOfferValue()
        );
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
                const value = Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        this.baseSellingPriceValue() - this.bestOfferValue(),
                        this.financeDownPaymentValue(),
                        this.financeTermValue()
                    )
                );
                return value;
            case 'lease':
                return this.leaseMonthlyPaymentsValue();
        }
    }

    leaseMonthlyPaymentsValue() {
        if (!this.data.dealLeasePayments) {
            return null;
        }
        if (!this.data.dealLeasePayments[this.leaseTerm()]) {
            return null;
        }

        if (
            !this.data.dealLeasePayments[this.leaseTerm()][0][
                this.leaseAnnualMileageValue()
            ]
        ) {
            return null;
        }

        return this.data.dealLeasePayments[this.leaseTerm()][0][
            this.leaseAnnualMileageValue()
        ].monthlyPayment;
    }

    leaseTermsAvailable() {
        if (!this.data.dealLeasePayments) {
            return null;
        }

        return Object.keys(this.data.dealLeasePayments)
            .map(item => parseInt(item, 10))
            .sort((a, b) => a - b);
    }

    leaseCashDueAvailable() {
        if (!this.data.dealLeasePayments) {
            return null;
        }

        const cashDueOptions = [];

        for (let term of Object.keys(this.data.dealLeasePayments)) {
            for (let cashDue of Object.keys(
                this.data.dealLeasePayments[term]
            )) {
                if (R.indexOf(cashDue, cashDueOptions) !== -1) {
                    continue;
                }

                cashDueOptions.push(cashDue);
            }
        }

        return cashDueOptions.map(item => parseInt(item, 10));
    }

    leaseAnnualMileageAvailable() {
        if (!this.data.dealLeasePayments) {
            return null;
        }

        const annualMileageOptions = [];

        for (let term of Object.keys(this.data.dealLeasePayments)) {
            for (let cashDue of Object.keys(
                this.data.dealLeasePayments[term]
            )) {
                for (let annualMileage of Object.keys(
                    this.data.dealLeasePayments[term][cashDue]
                )) {
                    if (R.indexOf(annualMileage, annualMileageOptions) !== -1) {
                        continue;
                    }

                    annualMileageOptions.push(annualMileage);
                }
            }
        }

        return annualMileageOptions
            .map(item => parseInt(item, 10))
            .sort((a, b) => a - b);
    }

    leasePaymentsForTermAndCashDueValue(term, cashDue) {
        if (!this.data.dealLeasePayments[term]) {
            return null;
        }

        if (!this.data.dealLeasePayments[term][cashDue]) {
            return null;
        }

        if (
            !this.data.dealLeasePayments[term][cashDue][
                this.leaseAnnualMileageValue()
            ]
        ) {
            return null;
        }

        return this.data.dealLeasePayments[term][cashDue][
            this.leaseAnnualMileageValue()
        ].monthlyPayment;
    }

    hasLeasePaymentsForTerm(term) {
        if (!this.data.dealLeasePayments[term]) {
            return false;
        }

        for (let cashDue in this.data.dealLeasePayments[term]) {
            if (
                !this.data.dealLeasePayments[term][cashDue][
                    this.leaseAnnualMileageValue()
                ]
            ) {
                return false;
            }
        }

        return true;
    }

    leasePaymentsForTermAndCashDue(term, cashDue) {
        const payment = this.leasePaymentsForTermAndCashDueValue(term, cashDue);

        return payment ? util.moneyFormat(payment) : null;
    }

    isSelectedLeasePaymentForTermAndCashDue(term, cashDue) {
        if (term != this.leaseTermValue()) {
            return false;
        }

        if (cashDue != this.leaseCashDueValue()) {
            return false;
        }

        return true;
    }

    leaseTotalAmountAtDriveOffValue() {
        if (!this.data.dealLeasePayments) {
            return null;
        }

        if (!this.data.dealLeasePayments[this.leaseTerm()]) {
            return null;
        }

        if (
            !this.data.dealLeasePayments[this.leaseTerm()][
                this.leaseCashDueValue()
            ]
        ) {
            return null;
        }

        if (
            !this.data.dealLeasePayments[this.leaseTerm()][
                this.leaseCashDueValue()
            ][this.leaseAnnualMileageValue()]
        ) {
            return null;
        }

        return this.data.dealLeasePayments[this.leaseTerm()][
            this.leaseCashDueValue()
        ][this.leaseAnnualMileageValue()].cashDue;
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

        for (let termRaw of this.data.dealLeaseRates.data) {
            const termData = {
                moneyFactor: termRaw.moneyFactor,
                residualPercent: termRaw.residualPercent,
                annualMileage: {},
            };

            for (let residuals of termRaw.residuals) {
                termData.annualMileage[residuals.annualMileage] = {
                    residualPercent: residuals.residualPercent,
                };
            }

            terms[termRaw.termMonths] = termData;
        }

        return terms;
    }

    isPricingLoading() {
        return !this.isPricingAvailable();
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
                if (this.data.dealLeaseRatesLoading) {
                    return false;
                }

                if (this.data.dealLeaseRates.length === 0) {
                    // If we have deal lease rates loaded but there are no rates available,
                    // then pricing IS available in the sense that there is no pricing.
                    return true;
                }

                return !this.data.dealLeasePaymentsLoading;
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

    cannotPurchase() {
        return !this.canPurchase();
    }

    canLease() {
        return this.hasLeaseTerms() && this.hasLeasePayments();
    }

    hasNoLeaseTerms() {
        return !this.hasLeaseTerms();
    }

    hasLeaseTerms() {
        if (!this.data.dealLeaseRates) {
            return false;
        }

        if (Object.keys(this.data.dealLeaseRates).length === 0) {
            return false;
        }

        return true;
    }

    hasLeasePayments() {
        if (!this.data.dealLeasePayments) {
            return false;
        }

        if (Object.keys(this.data.dealLeasePayments).length === 0) {
            return false;
        }

        return true;
    }

    leasePaymentsAreAvailable() {
        if (!this.data.dealLeaseRates) {
            // If lease rates are still loading, lease payments
            // are not yet available.
            return false;
        }

        if (this.data.dealLeaseRates.length === 0) {
            // If there are no lease rates at all, lease payments
            // are available (they should be empty).
            return true;
        }

        if (!this.data.dealLeasePayments) {
            return false;
        }

        return true;
    }
}

import formulas from 'src/formulas';
import util from 'src/util';
import R from 'ramda';
import Decimal from 'decimal.js';

import { dealPricingData } from 'apps/common/selectors';
import { dealPricingFromCheckoutData } from 'apps/checkout/selectors';

/**
 * Generate a deal pricing class using data pulled
 * from a mixture of user profile / deal detail / deal list data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const dealPricingFactory = (state, props) => {
    const data = dealPricingData(state, props);
    return new DealPricing(data);
};

/**
 * Generate a deal pricing class using mostly checkout data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const dealPricingFromCheckoutFactory = (state, props) => {
    const data = dealPricingFromCheckoutData(state, props);
    return new DealPricing(data);
};

export default class DealPricing {
    constructor(data) {
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

    allLeaseCashDueOptions() {
        return [0];
    }

    /**
     * @deprecated
     * @returns {boolean}
     */
    bestOfferIsLoading() {
        return this.data.dealQuoteIsLoading;
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
            value = Math.round(this.yourPriceValue() * 0.1);
        }

        return value;
    }

    financeDownPayment() {
        return util.moneyFormat(this.financeDownPaymentValue());
    }

    financeTermValue() {
        let value = this.data.financeTerm;
        if (value === null || value === undefined || value === 0) {
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

    effCvrFee() {
        return util.moneyFormat(this.effCvrFeeValue());
    }

    licenseAndRegistrationValue() {
        return this.data.deal.registration_fee;
    }

    licenseAndRegistration() {
        return util.moneyFormat(this.licenseAndRegistrationValue());
    }

    taxRate() {
        return 0.06;
    }

    acquisitionFeeValue() {
        return this.data.deal.acquisition_fee;
    }

    acquisitionFee() {
        return util.moneyFormat(this.acquisitionFeeValue());
    }

    bestOfferValue() {
        if (this.data.dealQuote && this.data.dealQuote.rebates) {
            return this.data.dealQuote.rebates.total;
        }

        return 0;
    }

    bestOffer() {
        return util.moneyFormat(this.bestOfferValue());
    }

    bestOfferPrograms() {
        return this.data.dealQuote.rebates;
    }

    employeeBrand() {
        return this.data.employeeBrand;
    }

    supplierBrand() {
        return this.data.supplierBrand;
    }

    discountedPriceValue() {
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

    discountedPrice() {
        return util.moneyFormat(this.discountedPriceValue());
    }

    discountValue() {
        return this.msrpValue() - this.discountedPriceValue();
    }

    discount() {
        return util.moneyFormat(this.discountValue());
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

    sellingPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                const total = new Decimal(this.discountedPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue());

                const totalWithSalesTax = total.plus(
                    Math.round(total.times(this.taxRate()))
                );

                return totalWithSalesTax;
            case 'lease':
                return new Decimal(this.discountedPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue())
                    .plus(this.acquisitionFeeValue())
                    .plus(this.taxOnRebatesValue());
        }
    }

    sellingPrice() {
        return util.moneyFormat(this.sellingPriceValue());
    }

    totalPriceValue() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                const total = new Decimal(this.discountedPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue());

                const totalWithSalesTax = total.plus(
                    Math.round(total.times(this.taxRate()))
                );

                return totalWithSalesTax;
            case 'lease':
                return Math.round(this.discountedPriceValue());
        }
    }

    totalPrice() {
        return util.moneyFormat(this.totalPriceValue());
    }

    cashPriceValue() {
        console.log({
            discountedPrice: this.discountedPriceValue(),
            bestOffer: this.bestOfferValue(),
        });
        return this.discountedPriceValue() - this.bestOfferValue();
    }

    cashPrice() {
        return util.moneyFormat(this.cashPriceValue());
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
                return this.cashPriceValue();
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
                        this.discountedPriceValue() - this.bestOfferValue(),
                        this.financeDownPaymentValue(),
                        this.financeTermValue()
                    )
                );
            case 'lease':
                return this.leaseMonthlyPaymentsValue();
        }
    }

    leaseMonthlyPaymentsValue() {
        if (!this.leasePayments()) {
            return null;
        }
        if (!this.leasePayments()[this.leaseTerm()]) {
            return null;
        }

        if (
            !this.leasePayments()[this.leaseTerm()][0][
                this.leaseAnnualMileageValue()
            ]
        ) {
            return null;
        }

        return this.leasePayments()[this.leaseTerm()][0][
            this.leaseAnnualMileageValue()
        ].monthlyPayment;
    }

    leaseTermsAvailable() {
        if (!this.leasePayments()) {
            return null;
        }

        return Object.keys(this.leasePayments())
            .map(item => parseInt(item, 10))
            .sort((a, b) => a - b)
            .filter((term, termIndex) => termIndex < 4);
    }

    leaseAnnualMileageAvailable() {
        if (!this.leasePayments()) {
            return [];
        }

        const annualMileageOptions = [];

        for (let term of Object.keys(this.leasePayments())) {
            for (let cashDue of Object.keys(this.leasePayments()[term])) {
                for (let annualMileage of Object.keys(
                    this.leasePayments()[term][cashDue]
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
            .sort((a, b) => a - b)
            .filter((term, termIndex) => termIndex < 4);
    }

    leasePaymentsForTermAndCashDueValue(term, cashDue, annualMileage) {
        if (!this.leasePayments()[term]) {
            return null;
        }

        if (!this.leasePayments()[term][cashDue]) {
            return null;
        }

        if (!this.leasePayments()[term][cashDue][annualMileage]) {
            return null;
        }

        return this.leasePayments()[term][cashDue][annualMileage]
            .monthlyPayment;
    }

    leasePaymentsForTermAndCashDue(term, cashDue, annualMileage) {
        const payment = this.leasePaymentsForTermAndCashDueValue(
            term,
            cashDue,
            annualMileage
        );

        return payment ? util.moneyFormat(payment) : null;
    }

    isSelectedLeasePaymentForTermAndCashDue(term, cashDue, annualMileage) {
        if (term != this.leaseTermValue()) {
            return false;
        }

        if (cashDue != this.leaseCashDueValue()) {
            return false;
        }

        if (annualMileage != this.leaseAnnualMileageValue()) {
            return false;
        }

        return true;
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

    isPricingLoading() {
        return !this.isPricingAvailable();
    }

    leaseRates() {
        if (this.data.dealQuote && this.data.dealQuote.rates) {
            return this.data.dealQuote.rates;
        }

        return null;
    }

    leasePayments() {
        if (this.data.dealQuote && this.data.dealQuote.payments) {
            return this.data.dealQuote.payments;
        }
        return null;
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
                if (this.data.dealQuoteIsLoading) {
                    return false;
                }

                if (this.leaseRates() && this.leaseRates().length === 0) {
                    // If we have deal lease rates loaded but there are no rates available,
                    // then pricing IS available in the sense that there is no pricing.
                    return true;
                }

                return !this.data.dealQuoteIsLoading;
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

    hasLeaseTerms() {
        if (!this.leaseRates()) {
            return false;
        }

        return Object.keys(this.leaseRates()).length !== 0;
    }

    hasLeasePayments() {
        if (!this.leasePayments()) {
            return false;
        }

        return Object.keys(this.leasePayments()).length !== 0;
    }

    taxOnRebatesValue() {
        return Math.round(this.bestOfferValue() * this.taxRate());
    }

    taxOnRebates() {
        return util.moneyFormat(this.taxOnRebatesValue());
    }

    taxesAndFeesTotalValue(taxesAndFees) {
        return (taxesAndFees || this.taxesAndFees()).reduce(
            (total, item) => total + item.rawValue,
            0
        );
    }

    taxesAndFeesTotal(taxesAndFees) {
        return util.moneyFormat(this.taxesAndFeesTotalValue(taxesAndFees));
    }

    taxesAndFees() {
        switch (this.data.paymentType) {
            case 'cash':
            case 'finance':
                const total = new Decimal(this.discountedPriceValue())
                    .plus(this.docFeeValue())
                    .plus(this.effCvrFeeValue());

                const salesTax = Math.round(total.times(this.taxRate()));

                return [
                    {
                        label: 'Doc Fee',
                        value: this.docFee(),
                        rawValue: this.docFeeValue(),
                    },
                    {
                        label: 'Electronic Filing Fee',
                        value: this.effCvrFee(),
                        rawValue: this.effCvrFeeValue(),
                    },
                    {
                        label: 'Sales Tax',
                        value: util.moneyFormat(salesTax),
                        rawValue: salesTax,
                    },
                ];

            case 'lease':
                return [
                    {
                        label: 'Doc Fee',
                        value: this.docFee(),
                        rawValue: this.docFeeValue(),
                    },
                    {
                        label: 'Electronic Filing Fee',
                        value: this.effCvrFee(),
                        rawValue: this.effCvrFeeValue(),
                    },
                    {
                        label: 'Acquisition Fee',
                        value: this.acquisitionFee(),
                        rawValue: this.acquisitionFeeValue(),
                    },
                    {
                        label: 'Tax on Rebates',
                        value: this.taxOnRebates(),
                        rawValue: this.taxOnRebatesValue(),
                    },
                ];
        }
    }
}

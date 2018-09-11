import formulas from 'src/formulas';
import { moneyFormat } from 'src/util';
import * as R from 'ramda';
import Decimal from 'decimal.js';

import { dealPricingData } from 'apps/common/selectors';
import { dealPricingFromCheckoutData } from 'apps/checkout/selectors';
import { getClosestNumberInRange } from 'src/util';

/**
 * Generate a deal pricing class using an object literal
 * for data.
 * @param data
 * @returns {DealPricing}
 */
export const dealPricingFromDataFactory = data => {
    return new DealPricing(data);
};

/**
 * Generate a deal pricing class from an existing
 * pricing instance.
 * @param dealPricing
 * @returns {DealPricing}
 */
export const dealPricingFromPricingFactory = pricing => {
    return dealPricingFromDataFactory(pricing.toData());
};

/**
 * Generate a deal pricing class using data pulled
 * from a mixture of user profile / deal detail / deal list data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const dealPricingFactory = (state, props) => {
    const data = dealPricingData(state, props);

    return dealPricingFromDataFactory(data);
};

/**
 * Generate a deal pricing class using mostly checkout data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const dealPricingFromCheckoutFactory = (state, props) => {
    const data = dealPricingFromCheckoutData(state, props);

    return dealPricingFromDataFactory(data);
};

export default class DealPricing {
    constructor(data) {
        this.data = data;
    }

    toData() {
        return this.data;
    }

    quote() {
        return this.data.dealQuote;
    }

    id() {
        return this.data.deal.id;
    }

    /** @deprecated */
    paymentType() {
        return this.data.paymentType;
    }

    paymentStrategy() {
        return this.data.paymentType;
    }

    make() {
        return this.data.deal.make;
    }

    allLeaseCashDueOptions() {
        return [0];
    }

    dealQuoteIsLoading() {
        return this.data.dealQuoteIsLoading;
    }

    dealQuoteIsLoaded() {
        return !this.data.dealQuoteIsLoading;
    }

    deal() {
        return this.data.deal;
    }

    leasePaymentInfo() {
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
        ];
    }

    leaseMonthlyPreTaxPaymentValue() {
        const info = this.leasePaymentInfo();

        if (!info) {
            return null;
        }

        return info.monthlyPreTaxPayment;
    }

    leaseMonthlyPreTaxPayment() {
        return moneyFormat(this.leaseMonthlyPreTaxPaymentValue());
    }

    leaseMonthlyUseTaxValue() {
        const info = this.leasePaymentInfo();

        if (!info) {
            return null;
        }

        return info.monthlyUseTax;
    }

    leaseMonthlyUseTax() {
        return moneyFormat(this.leaseMonthlyUseTaxValue());
    }

    leaseTotalAmountAtDriveOffValue() {
        const info = this.leasePaymentInfo();

        if (!info) {
            return null;
        }

        return Math.round(info.totalAmountAtDriveOff);
    }

    leaseTotalAmountAtDriveOff() {
        return moneyFormat(this.leaseTotalAmountAtDriveOffValue());
    }

    financeDownPaymentValue() {
        let value = this.data.financeDownPayment;

        if (value === null || value === undefined) {
            value = Math.round(this.yourPriceValue() * 0.1);
        }

        return value;
    }

    financeDownPayment() {
        return moneyFormat(this.financeDownPaymentValue());
    }

    effectiveTermValue() {
        switch (this.data.paymentType) {
            case 'cash':
                return null;
            case 'finance':
                return this.financeTermValue();
            case 'lease':
                return this.leaseTermValue();
        }
    }

    effectiveTerm() {
        return this.effectiveTermValue();
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

            return getClosestNumberInRange(36, leaseTermsAvailable);
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
        let value = this.leaseAnnualMileageValue();
        if (value) {
            return value.toLocaleString();
        }
        return null;
    }

    msrpValue() {
        return this.data.deal.pricing.msrp;
    }

    msrp() {
        return moneyFormat(this.msrpValue());
    }

    defaultPriceValue() {
        return this.data.deal.pricing.default;
    }

    defaultPrice() {
        return moneyFormat(this.defaultPriceValue());
    }

    employeePriceValue() {
        return this.data.deal.pricing.employee;
    }

    employeePrice() {
        return moneyFormat(this.employeePriceValue());
    }

    supplierPriceValue() {
        return this.data.deal.pricing.supplier;
    }

    supplierPrice() {
        return moneyFormat(this.supplierPriceValue());
    }

    docFeeValue() {
        return this.data.deal.doc_fee;
    }

    docFee() {
        return moneyFormat(this.docFeeValue());
    }

    docFeeWithTaxesValue() {
        return this.applyTax(this.docFeeValue());
    }

    docFeeWithTaxes() {
        return moneyFormat(this.docFeeWithTaxesValue());
    }

    effCvrFeeValue() {
        return this.data.deal.cvr_fee;
    }

    effCvrFee() {
        return moneyFormat(this.effCvrFeeValue());
    }

    effCvrFeeWithTaxesValue() {
        return this.applyTax(this.effCvrFeeValue());
    }

    effCvrFeeWithTaxes() {
        return moneyFormat(this.effCvrFeeWithTaxesValue());
    }

    licenseAndRegistrationValue() {
        return this.data.deal.registration_fee;
    }

    licenseAndRegistration() {
        return moneyFormat(this.licenseAndRegistrationValue());
    }

    applyTax(value) {
        return value + value * this.taxRate();
    }

    taxRate() {
        return 0.06;
    }

    acquisitionFeeValue() {
        return this.data.deal.acquisition_fee;
    }

    acquisitionFee() {
        return moneyFormat(this.acquisitionFeeValue());
    }

    bestOfferValue() {
        if (this.data.dealQuote && this.data.dealQuote.rebates) {
            return this.data.dealQuote.rebates.total;
        }

        return 0;
    }

    bestOffer() {
        return moneyFormat(this.bestOfferValue());
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
        return moneyFormat(this.discountedPriceValue());
    }

    discountValue() {
        return this.msrpValue() - this.discountedPriceValue();
    }

    discount() {
        return moneyFormat(this.discountValue());
    }

    dmrDiscountValue() {
        return this.msrpValue() - this.defaultPriceValue();
    }

    dmrDiscount() {
        return moneyFormat(this.dmrDiscountValue());
    }

    employeeDiscountValue() {
        return this.msrpValue() - this.employeePriceValue();
    }

    employeeDiscount() {
        return moneyFormat(this.employeeDiscountValue());
    }

    supplierDiscountValue() {
        return this.msrpValue() - this.supplierPriceValue();
    }

    supplierDiscount() {
        return moneyFormat(this.supplierDiscountValue());
    }

    discountType() {
        if (this.isEffectiveDiscountDmr()) {
            return 'dmr';
        }

        if (this.isEffectiveDiscountEmployee()) {
            return 'employee';
        }

        if (this.isEffectiveDiscountSupplier()) {
            return 'supplier';
        }

        return 'dmr';
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
        if (!this.data.discountType || this.data.discountType === 'dmr') {
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

        return false;
    }

    isCash() {
        return this.data.paymentType === 'cash';
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
        return moneyFormat(this.sellingPriceValue());
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
        return moneyFormat(this.totalPriceValue());
    }

    cashPriceValue() {
        return this.discountedPriceValue() - this.bestOfferValue();
    }

    cashPrice() {
        return moneyFormat(this.cashPriceValue());
    }

    yourPriceValue() {
        return new Decimal(this.sellingPriceValue()).minus(
            this.bestOfferValue()
        );
    }

    yourPrice() {
        return moneyFormat(this.yourPriceValue());
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

        return price ? moneyFormat(price) : null;
    }

    monthlyPaymentsValue() {
        switch (this.data.paymentType) {
            case 'finance':
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        this.sellingPriceValue() - this.bestOfferValue(),
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
            .filter(term => term > 7500)
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

        return payment ? moneyFormat(payment) : null;
    }

    isSelectedLeasePaymentForTermAndCashDue(term, cashDue, annualMileage) {
        if (term !== this.leaseTermValue()) {
            return false;
        }

        if (cashDue !== this.leaseCashDueValue()) {
            return false;
        }

        if (annualMileage !== this.leaseAnnualMileageValue()) {
            return false;
        }

        return true;
    }

    monthlyPayments() {
        const monthlyPayments = this.monthlyPaymentsValue();

        return monthlyPayments ? moneyFormat(monthlyPayments) : null;
    }

    amountFinancedValue() {
        switch (this.data.paymentType) {
            case 'finance':
                return this.yourPriceValue() - this.financeDownPaymentValue();
        }
    }

    amountFinanced() {
        return moneyFormat(this.amountFinancedValue());
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
        if (this.dealQuoteIsLoading()) {
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
        return moneyFormat(this.taxOnRebatesValue());
    }

    taxesAndFeesTotalValue(taxesAndFees) {
        return (taxesAndFees || this.taxesAndFees()).reduce(
            (total, item) => total + item.rawValue,
            0
        );
    }

    taxesAndFeesTotal(taxesAndFees) {
        return moneyFormat(this.taxesAndFeesTotalValue(taxesAndFees));
    }

    hasRebatesApplied() {
        return this.bestOfferValue() > 0;
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
                        value: moneyFormat(salesTax),
                        rawValue: salesTax,
                    },
                ];

            case 'lease':
                return [
                    {
                        label: 'First Payment',
                        value: this.monthlyPayments(),
                        rawValue: this.monthlyPaymentsValue(),
                    },
                    {
                        label: 'Doc Fee',
                        value: this.docFeeWithTaxes(),
                        rawValue: this.docFeeWithTaxesValue(),
                    },
                    {
                        label: 'Electronic Filing Fee',
                        value: this.effCvrFeeWithTaxes(),
                        rawValue: this.effCvrFeeWithTaxesValue(),
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

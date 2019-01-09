import { createSelector } from 'reselect';
import { getUserPurchaseStrategy } from '../../apps/user/selectors';

import { pricingFromDataFactory } from '../../apps/pricing/factory';

export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getDealDetailQuote = state => {
    return state.pages.dealDetails.quote;
};

export const getIsDealQuoteRefreshing = state => {
    return state.pages.dealDetails.isQuoteLoading;
};

export const dealQuoteIsLoading = createSelector(
    [getDealDetailQuote],
    quote => {
        return quote === null;
    }
);

export const getDiscountType = state => {
    return state.pages.dealDetails.discount.discountType;
};

export const getConditionalRoles = state => {
    return state.pages.dealDetails.discount.conditionalRoles;
};

export const getTradeIn = state => {
    return state.pages.dealDetails.trade;
};

export const getLease = state => {
    return state.pages.dealDetails.lease;
};

export const getFinance = state => {
    return state.pages.dealDetails.finance;
};

export const getDiscount = state => {
    return state.pages.dealDetails.discount;
};

const employeeBrand = state => {
    return state.pages.dealDetails.discount.employeeBrand === false
        ? null
        : state.pages.dealDetails.discount.employeeBrand;
};

const supplierBrand = state =>
    state.pages.dealDetails.discount.supplierBrand === false
        ? null
        : state.pages.dealDetails.discount.supplierBrand;

export const discountType = state => {
    return state.pages.dealDetails.discount.discountType;
};

const financeDownPayment = state => state.pages.dealDetails.finance.downPayment;
const financeTerm = state => state.pages.dealDetails.finance.term;

const leaseAnnualMileage = state => state.pages.dealDetails.lease.annualMileage;
const leaseTerm = state => state.pages.dealDetails.lease.term;
const leaseCashDue = state => state.pages.dealDetails.lease.cashDue;

const dealLeaseAnnualMileage = createSelector(
    leaseAnnualMileage,
    leaseAnnualMileage => {
        return leaseAnnualMileage;
    }
);

const dealLeaseTerm = createSelector(leaseTerm, leaseTerm => {
    return leaseTerm;
});

const dealLeaseCashDue = createSelector(leaseCashDue, leaseCashDue => {
    return leaseCashDue;
});

export const getUrlQuery = createSelector(
    getUserPurchaseStrategy,
    getDiscount,
    getLease,
    getFinance,
    (strategy, discount, lease, finance) => {
        let data = {
            strategy: strategy,
        };

        if (discount.discountType) {
            data.role = discount.discountType;
        }

        if (discount.conditionalRoles && discount.conditionalRoles.length) {
            data.rebates = discount.conditionalRoles;
        }

        if (strategy === 'finance') {
            if (finance.downPayment) {
                data['finance_down'] = finance.downPayment;
            }
            if (finance.term) {
                data['finance_term'] = finance.term;
            }
        }

        if (strategy === 'lease') {
            if (lease.annualMileage) {
                data['lease_mileage'] = lease.annualMileage;
            }
            if (lease.cashDue) {
                data['lease_due'] = lease.cashDue;
            }
            if (lease.term) {
                data['lease_term'] = lease.term;
            }
        }
        return data;
    }
);

export const dealPricingDataForDetail = createSelector(
    getDeal,
    getUserPurchaseStrategy,
    employeeBrand,
    supplierBrand,
    financeDownPayment,
    financeTerm,
    dealLeaseAnnualMileage,
    dealLeaseTerm,
    dealLeaseCashDue,
    discountType,
    getTradeIn,
    dealQuoteIsLoading,
    getDealDetailQuote,
    (
        deal,
        paymentType,
        employeeBrand,
        supplierBrand,
        financeDownPayment,
        financeTerm,
        dealLeaseAnnualMileage,
        dealLeaseTerm,
        dealLeaseCashDue,
        discountType,
        tradeIn,
        dealQuoteIsLoading,
        dealQuote
    ) => {
        if (!deal) {
            return false;
        }
        return {
            deal,
            paymentType,
            employeeBrand,
            supplierBrand,
            financeDownPayment,
            financeTerm,
            leaseAnnualMileage: dealLeaseAnnualMileage,
            leaseTerm: dealLeaseTerm,
            leaseCashDue: dealLeaseCashDue,
            discountType,
            tradeIn,
            dealQuoteIsLoading,
            dealQuote,
        };
    }
);

/**
 * Generate a pricing class using data pulled
 * from a mixture of user profile / deal detail / deal list data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const pricingFromDealDetail = state => {
    const data = dealPricingDataForDetail(state);
    return pricingFromDataFactory(data);
};

import { createSelector } from 'reselect';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import {
    getUserPurchaseStrategy,
    getUserZipcode,
} from '../../apps/user/selectors';
import { getDealFromProps } from '../../apps/common/selectors';
import { dealQuoteKey as generateDealQuoteKey } from '../../apps/pricing/helpers';
import { prop } from 'ramda';
import { getQuotes } from '../../apps/pricing/selectors';
import { pricingFromDataFactory } from '../../apps/pricing/factory';
const neverEqualSelector = createSelectorCreator(defaultMemoize, () => false);

export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getDealDetailQuote = state => {
    return state.pages.dealDetails.quote;
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

const employeeBrand = state => {
    return state.pages.dealDetails.discount.employeeBrand === false
        ? null
        : state.pages.dealDetails.discount.employeeBrand;
};

const supplierBrand = state =>
    state.pages.dealDetails.discount.supplierBrand === false
        ? null
        : state.pages.dealDetails.discount.supplierBrand;

export const discountType = state =>
    state.pages.dealDetails.discount.discountType;

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

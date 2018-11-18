import { createSelector } from 'reselect';
import { createSelectorCreator, defaultMemoize } from 'reselect';

import { prop } from 'ramda';
import { dealQuoteKey as generateDealQuoteKey } from '../../apps/pricing/helpers';

import {
    getUserZipcode,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';

import { getQuotes } from '../../apps/pricing/selectors';

const neverEqualSelector = createSelectorCreator(defaultMemoize, () => false);

export default state => state.common;
export const common = state => state.common;

export const deal = (state, props) => props.deal;

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

const getConditionalRoles = state => {
    return state.pages.dealDetails.discount.conditionalRoles;
};

const dealLeaseTerm = createSelector(leaseTerm, leaseTerm => {
    return leaseTerm;
});

const dealLeaseCashDue = createSelector(leaseCashDue, leaseCashDue => {
    return leaseCashDue;
});

const dealQuoteKey = neverEqualSelector(
    [
        deal,
        getUserZipcode,
        getUserPurchaseStrategy,
        discountType,
        getConditionalRoles,
    ],
    (deal, zipcode, purchaseStrategy, discountType, conditionalRoles) => {
        if (!deal || !zipcode || !purchaseStrategy) {
            return null;
        }
        let role = 'default';

        if (discountType === 'dmr' || !discountType) {
            role = 'default';
        } else {
            role = discountType;
        }
        return generateDealQuoteKey(
            deal,
            zipcode,
            purchaseStrategy,
            role,
            conditionalRoles
        );
    }
);

const dealQuote = createSelector(
    [getQuotes, dealQuoteKey],
    (quotes, dealQuoteKey) => {
        return prop(dealQuoteKey, quotes) || null;
    }
);

export const dealQuoteIsLoading = createSelector([dealQuote], quote => {
    return quote === null;
});

export const dealPricingData = createSelector(
    deal,
    getUserPurchaseStrategy,
    employeeBrand,
    supplierBrand,
    financeDownPayment,
    financeTerm,
    dealLeaseAnnualMileage,
    dealLeaseTerm,
    dealLeaseCashDue,
    discountType,
    dealQuoteIsLoading,
    dealQuote,
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
            dealQuoteIsLoading,
            dealQuote,
        };
    }
);

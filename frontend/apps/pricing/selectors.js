import { deal } from '../common/selectors';
import { getUserPurchaseStrategy, getUserZipcode } from '../user/selectors';
import { dealQuoteKey as generateDealQuoteKey } from './helpers';
import {
    createSelector,
    createSelectorCreator,
    defaultMemoize,
} from 'reselect';
import { prop } from 'ramda';
import { pricingFromDataFactory } from './factory';

export const getQuotes = state => {
    return state.pricing.quotes;
};

const neverEqualSelector = createSelectorCreator(defaultMemoize, () => false);

const dealQuoteKey = neverEqualSelector(
    [deal, getUserZipcode, getUserPurchaseStrategy],
    (deal, zipcode, purchaseStrategy) => {
        if (!deal || !zipcode || !purchaseStrategy) {
            return null;
        }
        return generateDealQuoteKey(
            deal,
            zipcode,
            purchaseStrategy,
            'default',
            []
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

export const dealPricingForGeneric = createSelector(
    deal,
    getUserPurchaseStrategy,
    dealQuoteIsLoading,
    dealQuote,
    (deal, paymentType, dealQuoteIsLoading, dealQuote) => {
        if (!deal) {
            return false;
        }
        return {
            deal,
            paymentType,
            employeeBrand: null,
            supplierBrand: null,
            financeDownPayment: null,
            financeTerm: null,
            leaseAnnualMileage: null,
            leaseTerm: null,
            discountType: 'default',
            tradeIn: { owed: 0, value: 0, estimate: null },
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
export const pricingFromGeneric = (state, props) => {
    const data = dealPricingForGeneric(state, props);
    return pricingFromDataFactory(data);
};

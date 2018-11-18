import { createSelector } from 'reselect';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { getUserPurchaseStrategy, getUserZipcode } from '../user/selectors';
import { dealQuoteKey as generateDealQuoteKey } from './helpers';
import { prop } from 'ramda';
import { deal, discountType } from '../common/selectors';
const neverEqualSelector = createSelectorCreator(defaultMemoize, () => false);

export const getQuotes = state => {
    return state.pricing.quotes;
};

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

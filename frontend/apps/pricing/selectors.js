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

export const dealQuoteIsLoading = createSelector([dealQuote], quote => {
    return quote === null;
});

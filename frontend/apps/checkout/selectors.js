import { createSelector } from 'reselect';
import { pricingFromDataFactory } from '../pricing/factory';

export const checkout = state => state.checkout;

export const dealPricingDataForCheckout = createSelector(
    [checkout],
    checkout => {
        return {
            deal: checkout.deal,
            paymentType: checkout.strategy,
            employeeBrand: checkout.employeeBrand,
            supplierBrand: checkout.supplierBrand,
            financeDownPayment: checkout.financeDownPayment,
            financeTerm: checkout.term,
            leaseAnnualMileage: checkout.leaseAnnualMileage,
            leaseTerm: checkout.term,
            tradeIn: checkout.tradeIn,
            discountType: checkout.role,
            dealQuoteIsLoading: false,
            dealQuote: checkout.quote,
        };
    }
);

/**
 * Generate a pricing class using mostly checkout data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const pricingFromCheckoutFactory = (state, props) => {
    const data = dealPricingDataForCheckout(state, props);
    return pricingFromDataFactory(data);
};

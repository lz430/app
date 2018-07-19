import { createSelector } from 'reselect';

import { deal } from 'apps/common/selectors';

export const checkout = state => state.checkout;

export const dealPricingFromCheckoutData = createSelector(
    [deal, checkout],
    (deal, checkout) => {
        return {
            deal,
            paymentType: checkout.strategy,
            employeeBrand: checkout.employeeBrand,
            supplierBrand: checkout.supplierBrand,
            financeDownPayment: checkout.financeDownPayment,
            financeTerm: checkout.term,
            leaseAnnualMileage: checkout.leaseAnnualMileage,
            leaseTerm: checkout.term,
            discountType: checkout.role,
            dealQuoteIsLoading: false,
            dealQuote: checkout.quote,
        };
    }
);

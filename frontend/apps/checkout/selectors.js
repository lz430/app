import { createSelector } from 'reselect';

export const checkout = state => state.checkout;

export const dealPricingFromCheckoutData = createSelector(
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
            discountType: checkout.role,
            dealQuoteIsLoading: false,
            dealQuote: checkout.quote,
        };
    }
);

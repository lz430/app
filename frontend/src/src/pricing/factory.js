import { dealPricingData } from 'apps/common/selectors';
import { dealPricingFromCheckoutData } from 'apps/checkout/selectors';
import LeasePricing from './LeasePricing';
import CashPricing from './CashPricing';
import FinancePricing from './FinancePricing';

/**
 * Generate a pricing class using an object literal
 * for data.
 * @param data
 * @returns {DealPricing}
 */
export const pricingFromDataFactory = data => {
    switch (data.paymentType) {
        case 'lease':
            return new LeasePricing(data);
        case 'cash':
            return new CashPricing(data);
        case 'finance':
            return new FinancePricing(data);
      default:
          return false;
    }
};

/**
 * Generate a pricing class using data pullled
 * from a deal pricing instance.
 * @param dealPricing
 * @returns {DealPricing}
 */
export const pricingFromDealPricingFactory = dealPricing => {
    return pricingFromDataFactory(dealPricing.toData());
};

/**
 * Generate a pricing class using data pulled
 * from a mixture of user profile / deal detail / deal list data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const pricingFromStateFactory = (state, props) => {
    const data = dealPricingData(state, props);

    return pricingFromDataFactory(data);
};

/**
 * Generate a pricing class using mostly checkout data.
 * @param state
 * @param props
 * @returns {DealPricing}
 */
export const pricingFromCheckoutFactory = (state, props) => {
    const data = dealPricingFromCheckoutData(state, props);

    return pricingFromDataFactory(data);
};

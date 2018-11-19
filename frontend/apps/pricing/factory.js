import LeasePricing from './calcs/LeasePricing';
import CashPricing from './calcs/CashPricing';
import FinancePricing from './calcs/FinancePricing';

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

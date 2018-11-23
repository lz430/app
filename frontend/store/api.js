import BrowseService from './services/browse';
import DealService from './services/deal';
import UserService from './services/user';
import CheckoutService from './services/checkout';
import BrochureService from './services/brochure';

class API {
    constructor() {
        this.browse = new BrowseService();
        this.deal = new DealService();
        this.user = new UserService();
        this.checkout = new CheckoutService();
        this.brochure = new BrochureService();
    }

    /**
     * Translate
     * @param response
     */
    translateApiErrors(response) {
        let errors = {};
        if (response.errors) {
            Object.entries(response.errors).forEach(([key, value]) => {
                console.log(value);
                if (Array.isArray(value)) {
                    errors[key] = value.pop();
                } else {
                    errors[key] = value;
                }
            });
        } else {
            errors['form'] = 'Error submitting form';
        }
        return errors;
    }
}

export default new API();

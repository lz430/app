import BrowseService from './services/browse';
import DealService from './services/deal';
import UserService from './services/user';
import CheckoutService from './services/checkout';
import BrochureService from './services/brochure';
import { parseCookies } from 'nookies';

class API {
    constructor(ctx = {}) {
        this.ctx = ctx;
        this.browse = new BrowseService(this);
        this.deal = new DealService(this);
        this.user = new UserService(this);
        this.checkout = new CheckoutService(this);
        this.brochure = new BrochureService(this);
    }

    /**
     * Translate
     * @param response
     */
    translateApiErrors(response) {
        let errors = {};
        if (response.errors) {
            Object.entries(response.errors).forEach(([key, value]) => {
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

    token = () => {
        return parseCookies(this.ctx);
    };
}

export default new API();

export const ApiClient = API;

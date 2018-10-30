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
}

export default new API();

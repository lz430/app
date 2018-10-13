import BrowseService from './services/browse';
import DealService from './services/deal';
import UserService from './services/user';
import CheckoutService from './services/checkout';

class API {
    constructor() {
        this.browse = new BrowseService();
        this.deal = new DealService();
        this.user = new UserService();
        this.checkout = new CheckoutService();
    }
}

export default new API();

import BrowseService from 'store/services/browse';
import DealService from 'store/services/deal';
import UserService from 'store/services/user';
import CheckoutService from 'store/services/checkout';

class API {
    constructor() {
        this.browse = new BrowseService();
        this.deal = new DealService();
        this.user = new UserService();
        this.checkout = new CheckoutService();
    }
}

export default new API();

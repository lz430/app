import BrowseService from 'store/services/browse';
import DealService from 'store/services/deal';
import UserService from 'store/services/user';

class API {
    constructor() {
        this.browse = new BrowseService();
        this.deal = new DealService();
        this.user = new UserService();
    }
}

export default new API();

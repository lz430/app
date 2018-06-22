import BrowseService from 'store/services/browse';
import DealService from 'store/services/deal';

class API {
    constructor() {
        this.browse = new BrowseService();
        this.deal = new DealService();
    }
}

export default new API();

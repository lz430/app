import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from 'reducers/index';
import { getMakes } from 'actions/index';
import R from 'ramda';
import qs from 'qs';

const initialState = {
    selectedBodyStyle: R.prop(
        'style',
        qs.parse(window.location.search.slice(1))
    ),
    selectedMakes: [],
    makes: null,
    dealPage: 0,
    deals: null,
    fallbackLogoImage: '/images/dmr-logo.svg',
    fallbackDealImage: '/images/dmr-logo.svg',
    sortStatus: 'asc',
    sortColumn: 'price',
};

export default () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(
            applyMiddleware(reduxThunk)
        )
    );

    store.dispatch(getMakes());

    return store;
}

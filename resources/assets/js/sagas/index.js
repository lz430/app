import { take, put, call, fork, select, takeLatest, all } from 'redux-saga/effects'

import * as ActionTypes from 'actiontypes/index';
import * as Actions from 'actions/index';
import api from 'src/api';

const withStateDefaults = (state, changed) => {
    return Object.assign(
        {},
        {
            makeIds: state.selectedMakes,
            modelIds: state.selectedModels,
            bodyStyles: state.selectedStyles,
            fuelType: state.selectedFuelType,
            transmissionType: state.selectedTransmissionType,
            segment: state.selectedSegment,
            features: state.selectedFeatures,
            featureCategories: state.featureCategories,
            includes: ['photos'],
            sortColumn: state.sortColumn,
            sortAscending: state.sortAscending,
            page: 1,
            year: state.selectedYear,
            zipcode: state.zipcode,
            zipInRange: state.zipInRange,
        },
        changed
    );
};

export function* getAllProducts() {
    const state = yield select();
    console.log("getAllProducts");
    const products = yield call(api.getDeals, withStateDefaults(state));
    console.log(products);
    yield put(Actions.receiveDeals(products));
}

export function* watchGetProducts() {
    console.log("watchGetProducts");
    const state = yield select();

    const action = (state.filterPage === 'deals'
        ? ActionTypes.REQUEST_DEALS
        : ActionTypes.REQUEST_MODEL_YEARS);

    yield takeLatest(ActionTypes.TOGGLE_FEATURE, getAllProducts)
}

export default function* root() {
    yield all([fork(getAllProducts), fork(watchGetProducts)])
}
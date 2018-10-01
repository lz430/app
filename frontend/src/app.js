import 'bootstrap';
import 'App.scss';
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore, { history } from 'store';

import DealList from 'pages/deal-list/Container';
import DealDetail from 'pages/deal-detail/Container';
import ComparePage from 'pages/compare/Container';
import CheckoutConfirm from 'pages/checkout-confirm/Container';
import CheckoutFinancing from 'pages/checkout-financing/Container';
import CheckoutComplete from 'pages/checkout-complete/Container';
import DeliverMyRide from 'components/App/App';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

const { store, persistor } = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
            <Switch>
              <DeliverMyRide>
                <Route path="/filter" component={DealList} />
                <Route path="/compare" component={ComparePage} />
                <Route path="/deals/:id" component={DealDetail} />
                <Route
                  path="/checkout/contact"
                  component={CheckoutConfirm}
                />
                <Route
                  path="/checkout/financing"
                  component={CheckoutFinancing}
                />
                <Route
                  path="/checkout/complete"
                  component={CheckoutComplete}
                />
              </DeliverMyRide>
            </Switch>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

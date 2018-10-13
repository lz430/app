import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store';
import DeliverMyRide from '../src/components/App/App';

const { store, persistor } = configureStore();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <DeliverMyRide>{this.props.children}</DeliverMyRide>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;

import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import DeliverMyRide from '../src/components/App/App';
import configureStore from '../src/store';

const { store, persistor } = configureStore();

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps({ ctx });
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Provider store={store}>
                    <DeliverMyRide>
                        <Component {...pageProps} />
                    </DeliverMyRide>
                </Provider>
            </Container>
        );
    }
}

export default MyApp;

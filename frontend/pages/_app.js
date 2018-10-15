import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import DeliverMyRide from '../src/components/App/App';
import configureStore from '../src/store';
import withRedux from 'next-redux-wrapper';
import { PersistGate } from 'redux-persist/integration/react';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps({ ctx });
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps, store } = this.props;

        //
        // Client
        if (store.__persistor) {
            return (
                <Container>
                    <Provider store={store}>
                        <DeliverMyRide>
                            <PersistGate
                                persistor={store.__persistor}
                                loading={null}
                            >
                                <Component {...pageProps} />
                            </PersistGate>
                        </DeliverMyRide>
                    </Provider>
                </Container>
            );
        }

        //
        // Server
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

export default withRedux(configureStore)(MyApp);

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
        return (
            <Container>
                <Provider store={store}>
                    <PersistGate
                        persistor={store.__persistor}
                        loading={<div>Loading</div>}
                    >
                        <DeliverMyRide>
                            <Component {...pageProps} />
                        </DeliverMyRide>
                    </PersistGate>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(configureStore)(MyApp);

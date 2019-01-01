import '@fortawesome/fontawesome-svg-core/styles.css';

import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import DeliverMyRide from '../components/App/App';
import configureStore from '../core/store';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import * as Sentry from '@sentry/browser';
import config from '../core/config';
import { requestLocation } from '../apps/user/actions';
import { PersistGate } from 'redux-persist/integration/react';
import { softUpdateSessionData, setCSRFToken } from '../apps/session/actions';

const SENTRY_PUBLIC_DSN = config['SENTRY_DSN'];

class MyApp extends App {
    static async getInitialProps({ Component, /*router, */ ctx }) {
        let pageProps = {};

        const isServer = !!ctx.req;

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        if (isServer) {
            const session = ctx.req.session;
            //
            // Location
            if (!session.location || !session.location.is_valid) {
                //await ctx.store.dispatch(
                //  requestLocation(null, ctx.req.session)
                //);
            }
            await softUpdateSessionData(session);
        }

        if (ctx.query.csrfToken) {
            await setCSRFToken(ctx.query.csrfToken);
        }

        return { pageProps };
    }

    /**
     * List of pages that we only expose the footer on the desktop view port
     * @type {string[]}
     */
    desktopOnlyFooter = ['/deal-list'];

    /**
     * @type {string[]}
     */
    brochureSiteRoutes = [
        '/home',
        '/brochure/contact',
        '/brochure/about',
        '/brochure/how-it-works',
        '/brochure/faq',
        '/brochure/terms-of-service',
        '/brochure/privacy-policy',
        '/brochure/concierge',
    ];

    constructor(...args) {
        super(...args);
        if (SENTRY_PUBLIC_DSN) {
            Sentry.init({
                dsn: SENTRY_PUBLIC_DSN,
                whitelistUrls: [
                    'app.delivermyride.com',
                    'delivermyride.com',
                    'staging.delivermyride.com',
                    'localhost:3000',
                ],
            });
        }
    }

    componentDidCatch(error, errorInfo) {
        if (config['SENTRY_DSN']) {
            Sentry.configureScope(scope => {
                Object.keys(errorInfo).forEach(key => {
                    scope.setExtra(key, errorInfo[key]);
                });
            });
            Sentry.captureException(error);
        }

        // This is needed to render errors correctly in development / production
        super.componentDidCatch(error, errorInfo);
    }

    render() {
        const { Component, pageProps, store } = this.props;
        const pathname = this.props.router.pathname;

        //
        // Client
        if (store.__persistor) {
            return (
                <Container>
                    <Provider store={store}>
                        <DeliverMyRide
                            desktopOnlyFooter={this.desktopOnlyFooter.includes(
                                pathname
                            )}
                            isBrochureSite={this.brochureSiteRoutes.includes(
                                pathname
                            )}
                        >
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
                    <DeliverMyRide
                        desktopOnlyFooter={this.desktopOnlyFooter.includes(
                            pathname
                        )}
                        isBrochureSite={this.brochureSiteRoutes.includes(
                            pathname
                        )}
                    >
                        <Component {...pageProps} />
                    </DeliverMyRide>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(configureStore)(withReduxSaga({ async: true })(MyApp));

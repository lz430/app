/**
 * From ReactGA Community Wiki Page https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
 */
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import config from '../config';

export default function withTracker(WrappedComponent, options = {}) {
    const trackPage = page => {
        if (!config['GOOGLE_ANALYTICS_UA']) {
            return false;
        }

        if (typeof window !== 'undefined') {
            if (!window.ga) {
                ReactGA.initialize(config['GOOGLE_ANALYTICS_UA']);
            }

            ReactGA.set({
                page,
                ...options,
            });
            ReactGA.pageview(page);
        }
    };

    return class extends Component {
        componentDidMount() {
            const page = this.props.router.asPath;
            trackPage(page);
        }

        componentDidUpdate(prevProps) {
            const currentPage = this.props.router.asPath;
            const nextPage = prevProps.router.asPath;

            if (currentPage !== nextPage) {
                trackPage(currentPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

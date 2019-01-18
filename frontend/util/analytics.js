import ReactGA from 'react-ga';
import config from '../core/config';

export const initGA = () => {
    if (config['GOOGLE_ANALYTICS_UA']) {
        ReactGA.initialize(config['GOOGLE_ANALYTICS_UA']);
    }
};

export const logPageView = () => {
    if (config['GOOGLE_ANALYTICS_UA']) {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
};

export const logEvent = (category = '', action = '') => {
    if (category && action) {
        ReactGA.event({ category, action });
    }
};

export const logException = (description = '', fatal = false) => {
    if (description) {
        ReactGA.exception({ description, fatal });
    }
};

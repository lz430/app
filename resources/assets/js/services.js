import mixpanel from 'mixpanel-browser';
import config from 'config';

mixpanel.init(config['MIXPANEL_TOKEN']);

/**
 *
 * @param event
 * @param options
 */
export function track(event, options = {}) {
    if (config['MIXPANEL_TOKEN']) {
        mixpanel.track(event, options);
    }
}

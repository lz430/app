import config from './config';
import mixpanel from 'mixpanel-browser';

/**
 *
 * @param event
 * @param properties
 */
export function track(event, properties = {}) {
    if (config['MIXPANEL_TOKEN']) {
        mixpanel.init(config['MIXPANEL_TOKEN']);
        mixpanel.track(event, properties);
    }
}

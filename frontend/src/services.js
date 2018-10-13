/* global mixpanel */

import config from './config';

/**
 *
 * @param event
 * @param properties
 */
export function track(event, properties = {}) {
    if (config['MIXPANEL_TRACK']) {
        mixpanel.track(event, properties);
    }
}

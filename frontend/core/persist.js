import storage from 'redux-persist/lib/storage';
import config from './config';

export const basePersistConfig = {
    storage,
    version: config.APPLICATION_VERSION,
    migrate: (state, currentVersion) => {
        if (
            state === undefined ||
            state._persist === undefined ||
            state._persist.version !== currentVersion
        ) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve(state);
    },
};

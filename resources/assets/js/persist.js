import storage from 'redux-persist/lib/storage';

const APPLICATION_VERSION = 23;

export const basePersistConfig = {
    storage,
    version: APPLICATION_VERSION,
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

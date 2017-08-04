const prefix = 'reduxPersist:';

const localStorageSync = {
    read(key) {
        const string = window.localStorage.getItem(prefix + key);

        if (string === null) {
            return [];
        }

        return JSON.parse(string);
    },
    write(key, newValue) {
        window.localStorage.setItem(prefix + key, JSON.stringify(newValue));
    },
};

export default localStorageSync;

const withSass = require('@zeit/next-sass');

require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = withSass({
    useFileSystemPublicRoutes: false,
    webpack: config => {
        config.plugins = config.plugins || [];

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true,
            }),
        ];

        const originalEntry = config.entry;
        config.entry = async () => {
            const entries = await originalEntry();

            if (
                entries['main.js'] &&
                !entries['main.js'].includes('./src/polyfills.js')
            ) {
                entries['main.js'].unshift('./src/polyfills.js');
            }
            console.log(entries);

            return entries;
        };

        return config;
    },
});

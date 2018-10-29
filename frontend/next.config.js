const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = withCSS(
    withSass({
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
                    !entries['main.js'].includes('./core/polyfills.js')
                ) {
                    entries['main.js'].unshift('./core/polyfills.js');
                }
                console.log(entries);

                return entries;
            };

            return config;
        },
    })
);

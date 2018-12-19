const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = withCSS(
    withSass({
        useFileSystemPublicRoutes: false,
        webpack: (config, { dev }) => {
            config.plugins = config.plugins || [];
            let env;

            if (dev) {
                env = new Dotenv({
                    path: path.join(__dirname, '.env'),
                    silent: true,
                });
            } else {
                env = new Dotenv({
                    systemvars: true,
                    silent: true,
                });
            }

            config.plugins = [...config.plugins, env];

            const originalEntry = config.entry;
            config.entry = async () => {
                const entries = await originalEntry();

                if (
                    entries['main.js'] &&
                    !entries['main.js'].includes('./core/polyfills.js')
                ) {
                    entries['main.js'].unshift('./core/polyfills.js');
                }

                return entries;
            };

            return config;
        },
    })
);

require('dotenv').config();

const { mix } = require('laravel-mix');
const path = require('path');

require('./loadIcons');

mix.webpackConfig({
    devtool: mix.config.inProduction
        ? 'source-map'
        : 'eval-cheap-module-source-map',

    resolve: {
        modules: [
            path.resolve('./resources/assets/js'),
            path.resolve('./node_modules'),
        ],
    },
});

mix.react('resources/assets/js/app.js', 'public/js').sass(
    'resources/assets/sass/app.scss',
    'public/css'
);

if (mix.inProduction()) {
    mix.version();
} else {
    mix.browserSync({
        proxy: process.env.APP_URL,
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
}

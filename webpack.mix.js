require('dotenv').config();

const { mix } = require('laravel-mix');
const path = require('path');

mix.webpackConfig({
    devtool: process.env.MIX_ENABLE_SOURCEMAPS ? 'source-map' : false,
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

const { mix } = require('laravel-mix');

require('./loadIcons');

mix.react('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css');

mix.webpackConfig({
    module: {
        rules: [{
            test: /\.svg$/,
            loader: 'raw-loader',
        }],
    },
});

if (mix.config.inProduction) {
    mix.version();
} else {
    mix.browserSync({
        proxy: 'localhost',
        notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            }
        }
    });
}

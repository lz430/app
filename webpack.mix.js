const { mix } = require('laravel-mix');

mix.react('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css');

if (mix.config.inProduction) {
    mix.version();
} else {
    mix.browserSync('localhost');
}

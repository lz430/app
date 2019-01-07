const sm = require('sitemap');
const { join } = require('path');
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

const sitemap = sm.createSitemap({
    hostname: 'https://delivermyride.com',
    cacheTime: 600000, // 600 sec - cache purge period
});

const setup = ({ server, app }) => {
    sitemap.add({
        url: '/',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/how-it-works',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/how-it-works',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/about',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/contact',
        changefreq: 'monthly',
        priority: 1,
    });

    sitemap.add({
        url: '/terms-of-service',
        changefreq: 'monthly',
        priority: 1,
    });

    sitemap.add({
        url: '/privacy-policy',
        changefreq: 'weekly',
        priority: 1,
    });

    server.get('/sitemap.xml', (req, res) => {
        sitemap.toXML((err, xml) => {
            if (err) {
                res.status(500).end();
                return;
            }

            res.header('Content-Type', 'application/xml');
            res.send(xml);
        });
    });

    server.get('/favicon.ico', (req, res) => {
        const path = join(__dirname, '../static', 'favicon.ico');
        app.serveStatic(req, res, path);
    });

    server.get('/robots.txt', (req, res) => {
        let file = 'robots.txt';
        if (!isProduction) {
            file = 'robots-dev.txt';
        }
        const path = join(__dirname, '../static', file);

        res.sendFile(path);
    });
};

module.exports = setup;

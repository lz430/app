const sm = require('sitemap');
const { join } = require('path');

const sitemap = sm.createSitemap({
    hostname: 'https://delivermyride.com',
    cacheTime: 600000, // 600 sec - cache purge period
});

const setup = ({ server, app }) => {
    sitemap.add({
        url: '/brochure',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/how-it-works',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/how-it-works',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/about',
        changefreq: 'weekly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/contact',
        changefreq: 'monthly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/terms-of-service',
        changefreq: 'monthly',
        priority: 1,
    });

    sitemap.add({
        url: '/brochure/privacy-policy',
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
        const path = join(__dirname, '../static', 'robots.txt');
        res.sendFile(path);
    });
};

module.exports = setup;

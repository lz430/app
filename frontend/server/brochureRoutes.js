const setup = ({ server, app }) => {
    server.get('/', (req, res) => {
        app.render(req, res, '/home', req.query);
    });

    server.get('/how-it-works', (req, res) => {
        app.render(req, res, '/brochure/how-it-works', req.query);
    });

    server.get('/faq', (req, res) => {
        app.render(req, res, '/brochure/faq', req.query);
    });

    server.get('/about', (req, res) => {
        app.render(req, res, '/brochure/about', req.query);
    });

    server.get('/contact', (req, res) => {
        app.render(req, res, '/brochure/contact', req.query);
    });

    server.get('/privacy-policy', (req, res) => {
        app.render(req, res, '/brochure/privacy-policy', req.query);
    });

    server.get('/terms-of-service', (req, res) => {
        app.render(req, res, '/brochure/terms-of-service', req.query);
    });
};

module.exports = setup;

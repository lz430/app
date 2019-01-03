const setup = ({ server, app, csrfProtection }) => {
    server.get('/my-account', (req, res) => {
        app.render(req, res, '/auth/my-account', req.query);
    });

    server.get('/my-account/update', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };
        app.render(req, res, '/auth/update-account', query);
    });

    server.get('/login', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };

        app.render(req, res, '/auth/login', query);
    });

    server.get('/signup', (req, res) => {
        app.render(req, res, '/auth/signup', req.query);
    });

    server.get('/forgot', (req, res) => {
        app.render(req, res, '/auth/forgot', req.query);
    });

    server.get('/forgot/change', (req, res) => {
        app.render(req, res, '/auth/forgot-change', req.query);
    });
};

module.exports = setup;

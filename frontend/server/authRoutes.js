const setup = ({ server, app, csrfProtection }) => {
    server.get('/my-account', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };

        app.render(req, res, '/auth/my-account', query);
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

    server.get('/signup', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };

        app.render(req, res, '/auth/signup', query);
    });

    server.get('/forgot', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };

        app.render(req, res, '/auth/forgot', query);
    });

    server.get('/forgot/change', csrfProtection, (req, res) => {
        const query = {
            ...req.query,
            csrfToken: req.csrfToken(),
        };

        app.render(req, res, '/auth/forgot-change', query);
    });
};

module.exports = setup;

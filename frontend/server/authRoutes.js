const setup = ({ server, app }) => {
    server.get('/login', (req, res) => {
        app.render(req, res, '/auth/login', req.query);
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

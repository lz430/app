const setup = ({ server, csrfProtection }) => {
    /*
     * Add route to get CSRF token via AJAX
     */
    server.get(`/csrf`, csrfProtection, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                csrfToken: req.csrfToken(),
            })
        );
    });

    /**
     * Used when the client needs to update the session
     */
    server.post('/session', csrfProtection, function(req, res) {
        Object.keys(req.body).map(key => {
            req.session[key] = req.body[key];
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 'okay' }));
    });

    /**
     * Delete session
     */
    server.post('/session/destroy', function(req, res) {
        req.session.destroy();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 'okay' }));
    });
};

module.exports = setup;

const setup = ({ server /*app*/ }) => {
    /**
     * Used when the client needs to update the session
     */
    server.post('/session', function(req, res) {
        Object.keys(req.body).map(key => {
            req.session[key] = req.body[key];
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 'okay' }));
    });
};

module.exports = setup;

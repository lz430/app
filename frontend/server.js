const { join } = require('path');

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare()
    .then(() => {
        const server = express();

        //
        // Static Root Assets
        server.get('/favicon.ico', (req, res) => {
            const path = join(__dirname, 'static', 'favicon.ico');
            app.serveStatic(req, res, path);
        });

        //
        // Application Routes
        server.get('/', (req, res) => {
            app.render(req, res, '/index', req.query);
        });

        server.get('/filter', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/deal-list', queryParams);
        });

        server.get('/deals/:id', (req, res) => {
            const queryParams = { id: req.params.id };
            app.render(req, res, '/deal-detail', queryParams);
        });

        server.get('/checkout/contact', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/checkout-contact', queryParams);
        });

        server.get('/checkout/financing', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/checkout-financing', queryParams);
        });

        server.get('/checkout/complete', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/checkout-complete', queryParams);
        });

        server.get('/compare', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/compare', queryParams);
        });

        server.get('/trade-in', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/trade-in', queryParams);
        });

        //
        // Brochure Site
        // Note: Temp prefix with /brochure... will rename all the routes when we go live.
        server.get('/brochure', (req, res) => {
            app.render(req, res, '/home', req.query);
        });

        server.get('/brochure/how-it-works', (req, res) => {
            app.render(req, res, '/brochure/how-it-works', req.query);
        });

        server.get('/brochure/faq', (req, res) => {
            app.render(req, res, '/brochure/faq', req.query);
        });

        server.get('/brochure/contact', (req, res) => {
            app.render(req, res, '/brochure/contact', req.query);
        });

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) {
                throw err;
            }
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });

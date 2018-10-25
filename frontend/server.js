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
            const actualPage = '/index';
            app.render(req, res, actualPage, req.query);
        });

        server.get('/filter', (req, res) => {
            const actualPage = '/deal-list';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/deals/:id', (req, res) => {
            const actualPage = '/deal-detail';
            const queryParams = { id: req.params.id };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/checkout/contact', (req, res) => {
            const actualPage = '/checkout-contact';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/checkout/financing', (req, res) => {
            const actualPage = '/checkout-financing';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/checkout/complete', (req, res) => {
            const actualPage = '/checkout-complete';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/compare', (req, res) => {
            const actualPage = '/compare';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/trade-in', (req, res) => {
            const actualPage = '/trade-in';
            const queryParams = { ...req.query };
            app.render(req, res, actualPage, queryParams);
        });

        //
        // Brochure Site
        // Note: Temp prefix with /brochure... will rename all the routes when we go live.
        server.get('/brochure', (req, res) => {
            const actualPage = '/home';
            app.render(req, res, actualPage, req.query);
        });

        server.get('/brochure/how-it-works', (req, res) => {
            const actualPage = '/how-it-works';
            app.render(req, res, actualPage, req.query);
        });

        server.get('/brochure/faq', (req, res) => {
            const actualPage = '/faq';
            app.render(req, res, actualPage, req.query);
        });

        server.get('/brochure/contact', (req, res) => {
            const actualPage = '/contact';
            app.render(req, res, actualPage, req.query);
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

const { join } = require('path');

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.get('/favicon.ico', (req, res) => {
            const path = join(__dirname, 'static', 'favicon.ico');
            app.serveStatic(req, res, path);
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

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });

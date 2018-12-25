const express = require('express');
const next = require('next');
const compression = require('compression');
const cookiesMiddleware = require('universal-cookie-express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const nextAuth = require('next-auth');
const nextAuthConfig = require('../next-auth.config');

const staticRoutes = require('./staticRoutes');
const authRoutes = require('./authRoutes');
const brochureRoutes = require('./brochureRoutes');
const sessionRoutes = require('./sessionRoutes');

app.prepare()
    .then(async () => {
        /*
        // Load configuration and return config object
        const nextAuthOptions = await nextAuthConfig();

        // Pass Next.js App instance and NextAuth options to NextAuth
        const nextAuthApp = await nextAuth(app, nextAuthOptions);
        const server = nextAuthApp.expressApp;
        */

        const server = express();
        server.use(express.json());
        server.use(
            session({
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true,
                //cookie: { secure: true },
                store: new MemoryStore({
                    checkPeriod: 86400000,
                }),
            })
        );

        if (!dev) {
            server.use(compression());
        }

        staticRoutes({ server, app });
        authRoutes({ server, app });
        brochureRoutes({ server, app });
        sessionRoutes({ server, app });

        server.get('/filter', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/deal-list', queryParams);
        });

        server.get('/deals/:id', (req, res) => {
            const queryParams = { id: req.params.id };
            return app.render(req, res, '/deal-detail', queryParams);
        });

        server.get('/checkout/contact', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/checkout-contact', queryParams);
        });

        server.get('/checkout/financing', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/checkout-financing', queryParams);
        });

        server.get('/checkout/complete', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/checkout-complete', queryParams);
        });

        /*
        server.get('/compare', (req, res) => {
            const queryParams = { ...req.query };
            app.render(req, res, '/compare', queryParams);
        });
        */

        //
        // Experiment / Beta Pages
        server.get('/experiments/kb-poc', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/experiments/kb-poc', queryParams);
        });

        server.get('/experiments/tp-poc', (req, res) => {
            const queryParams = { ...req.query };
            return app.render(req, res, '/experiments/tp-poc', queryParams);
        });

        server.get('/experiments/concierge', (req, res) => {
            return app.render(req, res, '/experiments/concierge', req.query);
        });

        // Default catch-all handler to allow Next.js to handle all other routes
        /*
        server.all('*', (req, res) => {
            let nextRequestHandler = app.getRequestHandler();
            return nextRequestHandler(req, res);
        });

        server.listen(3000, err => {
            if (err) {
                throw err;
            }
            console.log(
                '> Ready on http://localhost:' + 3000 + ' [' + 3000 + ']'
            );
        });
        */

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

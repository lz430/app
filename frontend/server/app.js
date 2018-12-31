const express = require('express');
const next = require('next');
const compression = require('compression');
const csrf = require('csurf');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const RedisStore = require('connect-redis')(session);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const staticRoutes = require('./staticRoutes');
const authRoutes = require('./authRoutes');
const brochureRoutes = require('./brochureRoutes');
const sessionRoutes = require('./sessionRoutes');

const csrfProtection = csrf({});

console.log(process.env);

app.prepare()
    .then(async () => {
        const server = express();
        server.use(express.json());

        if (dev) {
            server.use(
                session({
                    secret: 'RnaomasdFfasr4',
                    resave: false,
                    saveUninitialized: true,
                    //cookie: { secure: true },
                    store: new MemoryStore({
                        checkPeriod: 86400000,
                    }),
                })
            );
        } else {
            server.use(
                session({
                    secret: 'zxcvzxasdFFwwA5',
                    resave: false,
                    saveUninitialized: true,
                    //cookie: { secure: true },
                    store: new RedisStore({
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT,
                    }),
                })
            );
        }

        if (!dev) {
            server.use(compression());
        }

        staticRoutes({ server, app, csrfProtection });
        authRoutes({ server, app, csrfProtection });
        brochureRoutes({ server, app, csrfProtection });
        sessionRoutes({ server, app, csrfProtection });

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

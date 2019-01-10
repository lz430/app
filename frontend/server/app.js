const express = require('express');
const next = require('next');
const compression = require('compression');
const csrf = require('csurf');
const session = require('express-session');
const morgan = require('morgan');

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

const pathsToSkip = ['/ping', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

const unless = function(paths, middleware, match = 'exact') {
    return function(req, res, next) {
        if (match === 'exact' && paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

app.prepare()
    .then(async () => {
        const server = express();
        server.enable('trust proxy');
        server.use(express.json());

        if (dev) {
            server.use(
                unless(
                    pathsToSkip,
                    session({
                        secret: 'RnaomasdFfasr4',
                        resave: false,
                        saveUninitialized: true,
                        //cookie: { secure: true },
                        store: new MemoryStore({
                            checkPeriod: 86400000,
                        }),
                    })
                )
            );
        } else {
            server.use(
                unless(
                    pathsToSkip,
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
                )
            );
            server.use(
                unless(
                    pathsToSkip,
                    morgan('combined', { stream: process.stdout })
                )
            );
        }

        if (!dev) {
            server.use(compression());
        }

        staticRoutes({ server, app, csrfProtection });
        authRoutes({ server, app, csrfProtection });
        brochureRoutes({ server, app, csrfProtection });
        sessionRoutes({ server, app, csrfProtection });

        server.get('/filter', csrfProtection, (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/deal-list', query);
        });

        server.get('/deals/:id', csrfProtection, (req, res) => {
            const queryParams = {
                id: req.params.id,
                quoteSettings: req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/deal-detail', queryParams);
        });

        server.get('/checkout/contact', csrfProtection, (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/checkout-contact', query);
        });

        server.get('/checkout/financing', csrfProtection, (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/checkout-financing', query);
        });

        server.get('/checkout/complete', csrfProtection, (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/checkout-complete', query);
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
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/experiments/kb-poc', query);
        });

        server.get('/experiments/tp-poc', (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };
            return app.render(req, res, '/experiments/tp-poc', query);
        });

        server.get('/experiments/concierge', (req, res) => {
            const query = {
                ...req.query,
                csrfToken: req.csrfToken(),
            };

            return app.render(req, res, '/experiments/concierge', query);
        });

        server.get('/ping', (req, res) => {
            res.send('pong');
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

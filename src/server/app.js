import auth from 'express-zetkin-auth';
import cookieParser from 'cookie-parser';
import Raven from 'raven';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import expressWs from 'express-ws';
import http from 'http';
import url from 'url';
import path from 'path';

import api from './api';
import dataRouter from './datarouter';
import search from './search';
import widgets from './widgets';
import prints from './prints';
import { loadLocaleHandler } from './locale';
import App from '../components/App';
import ActivistPage from '../components/fullpages/ActivistPage';
import IntlReduxProvider from '../components/IntlReduxProvider';
import { setPanesFromUrlPath } from '../actions/view';
import { setActiveOrg } from '../actions/user';

const packageJson = require('../../../package.json');


const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
    const ravenConfig = {
        release: packageJson.version,
        environment: process.env.NODE_ENV,
        tags: {
            domain: process.env.ZETKIN_DOMAIN,
        },
    };

    Raven.config(SENTRY_DSN, ravenConfig).install();
}


const authOpts = {
    loginUrl: process.env.ZETKIN_LOGIN_URL,
    logoutRedirPath: '/logged-out',
    app: {
        id: process.env.ZETKIN_APP_ID,
        key: process.env.ZETKIN_APP_KEY,
    }
};


export default function initApp(messages) {
    let app = express();

    if (SENTRY_DSN) {
        app.use(Raven.requestHandler());
    }

    if (process.env.NODE_ENV !== 'production') {
        // When not in production, redirect requests for the main JS file to the
        // Webpack dev server running on localhost.
        app.get('/static/main.js', function(req, res) {
            let wpMainJs = url.format({
                hostname: req.host,
                port: process.env.WEBPACK_PORT || 81,
                pathname: '/static/main.js',
            });

            res.redirect(303, wpMainJs);
        });
    }

    app.use('/favicon.ico', (req, res) =>
        res.status(404).type('txt').send('Not found'));

    app.use('/static/', express.static(
        path.join(__dirname, '../../static'),
        { fallthrough: false }));

    app.use(cookieParser());

    app.get('/logged-out', (req, res) => {
        res.redirect('//www.' + process.env.ZETKIN_DOMAIN);
    });

    app.use(auth.initialize(authOpts));
    app.get('/', auth.callback(authOpts));
    app.use(auth.validate(authOpts));
    app.get('/logout', auth.logout(authOpts));

    app.use(dataRouter(messages));
    app.use('/api', api);
    app.get('/l10n', loadLocaleHandler());
    app.use('/widgets', widgets);

    app.use('/prints', prints);

    expressWs(app);
    app.ws('/search', search);

    app.get('/activist', function(req, res, next) {
        if (req.store.getState().user.memberships.length) {
            // Officials should not be able to see the message to non-officials,
            // which would be very confusing.
            res.redirect(303, '/');
        }
        else {
            renderReactPage(ActivistPage, req, res);
        }
    });

    // Route for switching organizations
    app.get('*', (req, res, next) => {
        let state = req.store.getState();
        let orgId = null;

        let orgIsValid = orgId =>
            !!state.user.memberships.find(m => m.organization.id == orgId);

        if (req.query.org && orgIsValid(req.query.org)) {
            // Will store organization from querystring in cookie and redirect.
            // The next request will fall into the next condition.
            res.cookie('activeOrgId', req.query.org);
            res.redirect('/');
            return;
        }
        else if (req.cookies.activeOrgId) {
            // Will use organization from cookie, if (still) valid
            if (orgIsValid(req.cookies.activeOrgId)) {
                req.store.dispatch(setActiveOrg(req.cookies.activeOrgId));
            }
            else {
                res.clearCookie('activeOrgId');
            }

            next();
        }
        else {
            // Will use default, which is first organization
            next();
        }
    });

    if (SENTRY_DSN) {
        app.use(Raven.errorHandler());
    }

    app.use(function(req, res, next) {
        if (req.url == '/search') {
            // Don't render any output for search. Because of how
            // the express-ws middleware works, all routes must
            // call next(), even if the route is later in the chain
            // than the ws handler.
            return next();
        }

        if (req.store.getState().user.memberships.length == 0) {
            // User has no official roles in any organization
            res.redirect(303, '/activist');
            return;
        }

        renderReactPage(App, req, res);
    });

    return app;
}

function renderReactPage(Component, req, res) {
    // Remove all segments of path representing panes that refer to draft data,
    // which will not be available after a refresh.
    let pathWithoutDrafts = req.path
        .split('/')
        .filter(s => s.indexOf(':$') < 0 && s.indexOf(',$') < 0)
        .join('/');

    // If there were references to drafts, redirect to path without drafts.
    if (pathWithoutDrafts !== req.path) {
        res.redirect(pathWithoutDrafts);
        return;
    }

    try {
        req.store.dispatch(setPanesFromUrlPath(req.path));

        var PageFactory = React.createFactory(Component);
        var props = {
            initialState: req.store.getState(),
            path: req.path,
        };

        var html = ReactDOMServer.renderToString(
            React.createElement(IntlReduxProvider, { store: req.store },
                PageFactory(props)));

        res.send(html);
    }
    catch (err) {
        if (SENTRY_DSN) {
            Raven.captureException(err);
        }

        throw err; // TODO: Better error handling
    }
}

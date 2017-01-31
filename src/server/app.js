import auth from 'express-zetkin-auth';
import cookieParser from 'cookie-parser';
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
import { loadLocaleHandler } from './locale';
import App from '../components/App';
import ActivistPage from '../components/fullpages/ActivistPage';
import IntlReduxProvider from '../components/IntlReduxProvider';
import { setPanesFromUrlPath } from '../actions/view';


const authOpts = {
    loginUrl: process.env.ZETKIN_LOGIN_URL,
    app: {
        id: process.env.ZETKIN_APP_ID,
        key: process.env.ZETKIN_APP_KEY,
    }
};


export default function initApp(messages) {
    let app = express();

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

    app.use(auth.initialize(authOpts));
    app.get('/', auth.callback(authOpts));
    app.use(auth.validate(authOpts));
    app.get('/logout', auth.logout(authOpts));

    app.use(dataRouter(messages));
    app.use('/api', api);
    app.get('/l10n', loadLocaleHandler());
    app.use('/widgets', widgets);

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
        throw err; // TODO: Better error handling
    }
}

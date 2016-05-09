import FluxComponent from 'flummox/component';
import cookieParser from 'cookie-parser';
import React from 'react/addons';
import express from 'express';
import expressWs from 'express-ws';
import http from 'http';
import path from 'path';
import Z from 'zetkin';

import dataRouter from './datarouter';
import authRouter from './authrouter';
import apiProxy from './apiproxy';
import search from './search';
import widgets from './widgets';
import App from '../components/App';
import ActivistPage from '../components/fullpages/ActivistPage';


var app = express();

app.use('/api', apiProxy);
app.use(cookieParser());
app.use(authRouter);

app.use('/favicon.ico', (req, res) =>
    res.status(404).type('txt').send('Not found'));

app.use('/static/', express.static(
    path.join(__dirname, '../../static'),
    { fallthrough: false }));

app.get('/logout', function(req, res, next) {
    Z.resource('/session').del()
        .then(function(result) {
            res.clearCookie('apitoken');
            res.redirect(303, '/');
        })
        .catch(function(err) {
            res.redirect(303, '/');
        });
});

app.use(dataRouter);
app.use('/widgets', widgets);

expressWs(app);
app.ws('/search', search);

function renderReactPage(Component, req, res) {
    try {
        var PageFactory = React.createFactory(Component);
        var props = {
            path: req.path
        };

        var html = React.renderToString(
            React.createElement(FluxComponent, { flux: req.flux },
                PageFactory(props, { flux: req.flux })));

        res.send(html);
    }
    catch (err) {
        res.send('ERROR!')
        throw err; // TODO: Better error handling
    }
}

app.get('/activist', function(req, res, next) {
    if (req.flux.getStore('user').isOfficial()) {
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

    renderReactPage(App, req, res);
});

module.exports = app;

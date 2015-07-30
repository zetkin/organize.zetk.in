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
import App from '../components/App';


var app = express();

app.use('/api', apiProxy);
app.use(cookieParser());
app.use(authRouter);

app.use('/favicon.ico', (req, res) =>
    res.status(404).type('txt').send('Not found'));

app.use('/static/', express.static(
    path.join(__dirname, '../../static'),
    { fallthrough: false }));

app.use(dataRouter);

expressWs(app);
app.ws('/search', search);

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

app.get('/officialsonly', function(req, res, next) {
    // TODO: Implement error screen (static?)
    res.type('text/plain');
    res.send('You are not an official');
});

app.use(function(req, res, next) {
    if (req.url == '/search') {
        // Don't render any output for search. Because of how
        // the express-ws middleware works, all routes must
        // call next(), even if the route is later in the chain
        // than the ws handler.
        return next();
    }

    try {
        var AppFactory = React.createFactory(App);
        var props = {
            base: 'http://' + req.headers.host,
            path: req.path
        };

        var html = React.renderToString(
            React.createElement(FluxComponent, { flux: req.flux },
                AppFactory(props)));

        res.send(html);
    }
    catch (err) {
        res.send('ERROR!')
        throw err; // TODO: Better error handling
    }
});

module.exports = app;

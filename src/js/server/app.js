import FluxComponent from 'flummox/component';
import cookieParser from 'cookie-parser';
import React from 'react/addons';
import express from 'express';
import http from 'http';
import path from 'path';
import Z from 'zetkin';

import dataRouter from './datarouter';
import authRouter from './authrouter';
import apiProxy from './apiproxy';
import App from '../components/App';


var app = express();

app.use('/api', apiProxy);
app.use(cookieParser());
app.use(authRouter);
app.use(dataRouter);
app.use('/static/', express.static(path.join(__dirname, '../../static')));

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

app.use(function(req, res, next) {
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

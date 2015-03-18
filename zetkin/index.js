'use strict';

// Enable JSX conversion globally
require('node-jsx').install({ extension: '.jsx' });

var React = require('react/addons');
var reactApp = require('./react/app.jsx');
var template = require('./utils/template');
var data = require('./bootstrap/data');
var express = require('express');
var http = require('http');
var path = require('path');

var app = module.exports = express();

var api = express.Router()
api.all(/(.*)/, function(req, res) {
    // TODO: Verify data?
    var options = {
        // TODO: Handle any verb (check req.method)
        host: process.env.API_HOST,
        port: process.env.API_PORT,
        path: req.path
    };

    var request = http.request(options, function(response) {
        // TODO: Reserialize data?
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            res.send(chunk);
        });
    });

    request.end();
});

app.use('/api', api);
app.use('/static/', express.static(path.join(__dirname, '../static')));

var renderBaseTemplate = template.makeFileRenderer('templates/base.html');

app.use(function(req, res, next) {
    data.loadDataForRequest(req, function(data) {
        try {
            var App = React.createFactory(reactApp);
            var content = React.renderToString(App({ data: data }));
            var html = renderBaseTemplate({
                title: 'Zetkin',
                data: JSON.stringify(data),
                react_markup: content
            });

            res.send(html);
        } catch (err) {
            // TODO: Global error handling
            console.log(err);
            return next();
        }
    });
});

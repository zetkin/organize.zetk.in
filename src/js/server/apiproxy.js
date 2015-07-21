import express from 'express';
import http from 'http';

// API router which forwards all API calls
var apiProxy = express.Router();
apiProxy.all(/(.*)/, function(req, res) {
    var clientData = '';

    var headers = {
        // TODO: Somehow use client address, even if it's the server
        // that is making the request as part of a pre-render.
        'X-Forwarded-For': req.connection.remoteAddress
    };

    if ('authorization' in req.headers) {
        headers['authorization'] = req.headers['authorization'];
    }

    var options = {
        // TODO: Handle all verbs properly
        method: req.method,
        host: process.env.API_HOST,
        port: process.env.API_PORT,
        path: req.url,
        headers: headers
    };

    var request = http.request(options, function(response) {
        // TODO: Perform error-checking and possibly verify data?
        res.type('json');

        var data = '';

        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
            res.statusCode = response.statusCode;
            res.end(data);
        });
    });

    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        clientData += chunk;
    });

    req.on('end', function() {
        request.end(clientData);
    });
});

export default apiProxy;

'use strict';

var test = require('tape');
var servertest = require('servertest');
var http = require('http');
var app = require('../zetkin');

process.env.API_HOST = 'localhost';

function setupApi(requestHandler, cb) {
    var server = http.createServer(requestHandler).listen(function () {
        process.env.API_PORT = server.address().port;
        cb(null, function () {
            server.close();
        });
    });
}

test('/', function (t) {
    var server = http.createServer(app);
    servertest(server, '/', function (err, res) {
        if (err) {
            return t.end(err);
        }

        t.equal(res.statusCode, 200, 'correct status code');
        t.end();
    });
});

test('/api', function (t) {
    setupApi(function (req, res) {
      res.end('Beep boop');
    }, function (err, done) {
        var server = http.createServer(app);
        servertest(server, '/api', function (err, res) {
            if (err) {
                return t.end(err);
            }

            t.equal(res.statusCode, 200, 'correct status code');
            t.equal(res.body.toString(), 'Beep boop');
            t.end();
            done();
        });
    });
});

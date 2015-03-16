express = require('express');
http = require('http');

app = express();

api = express.Router()
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

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('Hello, world!');
});

var server = app.listen(80, function() {
    var addr = server.address();
    console.log('Listening on http://%s:%s', addr.address, addr.port);
});

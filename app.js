express = require('express');

app = express();

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('Hello, world!');
});

var server = app.listen(80, function() {
    var addr = server.address();
    console.log('Listening on http://%s:%s', addr.address, addr.port);
});

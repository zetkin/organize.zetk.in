'use strict';

var app = require('../');

var server = app.listen(80, function() {
    var addr = server.address();
    console.log('Listening on http://%s:%s', addr.address, addr.port);
});

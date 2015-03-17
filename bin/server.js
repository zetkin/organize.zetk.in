'use strict';

var app = require('../zetkin');

var server = app.listen(8000, function() {
    var addr = server.address();
    console.log('Listening on http://%s:%s', addr.address, addr.port);
});

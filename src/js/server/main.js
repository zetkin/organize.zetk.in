import Z from 'zetkin';

import app from './app';
import polyfills from '../utils/polyfills';

var port = process.env.ZETKIN_FRONTEND_PORT || 8000;

var server = app.listen(port, function() {
    var addr = server.address();

    // Code running on server should make API calls to itself.
    Z.configure({
        base: '/api',
        host: addr.address,
        port: addr.port,
        ssl: false
    });

    console.log('Listening on http://%s:%s', addr.address, addr.port);
});

import Z from 'zetkin';
import path from 'path';

import polyfills from '../utils/polyfills';
import initApp from './app';
import { loadMessages } from './locale';

var port = process.env.ZETKIN_FRONTEND_PORT || 80;
let msgPath = path.join(__dirname, '../../locale');

const USE_TLS = (process.env.ZETKIN_USE_TLS == '1')


loadMessages(msgPath, (err, messages) => {
    if (err) {
        console.log('Error loading messages', err);
    }

    let app = initApp(messages);
    let server = app.listen(port, function() {
        let addr = server.address();

        Z.configure({
            host: 'api.' + process.env.ZETKIN_DOMAIN,
            port: USE_TLS? 443 : 80,
            ssl: USE_TLS,
        });

        console.log('Listening on http://%s:%s', addr.address, addr.port);
    });
});

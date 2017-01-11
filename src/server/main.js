import Z from 'zetkin';
import path from 'path';

import polyfills from '../utils/polyfills';
import initApp from './app';
import { loadMessages } from './locale';

var port = process.env.ZETKIN_FRONTEND_PORT || 80;
let msgPath = path.join(__dirname, '../../locale');

loadMessages(msgPath, (err, messages) => {
    if (err) {
        console.log('Error loading messages', err);
    }

    let app = initApp(messages);
    let server = app.listen(port, function() {
        let addr = server.address();

        Z.configure({
            host: 'api.' + process.env.ZETKIN_DOMAIN,
            port: 80,
            ssl: false
        });

        console.log('Listening on http://%s:%s', addr.address, addr.port);
    });
});

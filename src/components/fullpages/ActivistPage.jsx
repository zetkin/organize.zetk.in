import React from 'react';

import GoogleAnalytics from '../misc/GoogleAnalytics';


export default class ActivistPage extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>Restricted area</title>
                </head>
                <body>
                    <h1>Hi there, activist!</h1>
                    <p>
                        To make use of the Zetkin Organizer you have to be an
                        organizer or admin in at least one organization.
                    </p>
                    <p>
                        <a href="/logout">Sign out and log in as organizer</a>
                    </p>
                    <GoogleAnalytics />
                </body>
            </html>
        );
    }
}

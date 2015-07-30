import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class ActivistPage extends FluxComponent {
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
                </body>
            </html>
        );
    }
}

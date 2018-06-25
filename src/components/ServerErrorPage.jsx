import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Logo from './header/Logo';

export default class ServerErrorPage extends React.Component {
    render() {
        return (
          <html>
            <head>
                <script src="https://use.typekit.net/tqq3ylv.js"></script>
                <script>{"try{Typekit.load({ async: true })}catch(e){}"}</script>
                <title>Zetkin Organize</title>
                <script src="/static/main.js"></script>
                <link rel="stylesheet" type="text/css"
                    href="/static/css/style.css"/>
                <link rel="icon" type="image/png"
                    href="/static/images/favicon.png"/>
            </head>
            <body>
                <div className="App ServerErrorPage">
                    <div className="ServerErrorPage-topBar">
                        <Logo/>
                    </div>
                    <div className="ServerErrorPage-content">
                        <h1 className="ServerErrorPage-title">
                            <Msg id="errors.server.title" />
                        </h1>
                        <p className="ServerErrorPage-description">
                            <Msg id="errors.server.description" />
                        </p>
                        <a href="/" className="ServerErrorPage-link" >
                            <Msg id="errors.server.link" />
                        </a>
                    </div>
                </div>
            </body>
          </html>
        );
    }
}

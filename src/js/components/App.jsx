import React from 'react/addons';

import FluxComponent from './FluxComponent';


export default class App extends FluxComponent {
    render() {
        var json = {
            __html: this.context.flux.serialize()
        };

        return (
            <html>
                <head>
                    <script src="/static/js/main.js"></script>
                </head>
                <body>
                    <script type="text/json"
                        id="bootstrap-data"
                        dangerouslySetInnerHTML={ json }/>
                </body>
            </html>
        );
    }
}

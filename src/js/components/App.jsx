import React from 'react/addons';
import Router from 'react-router-component';

import FluxComponent from './FluxComponent';
import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';


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
                    <div id="app">
                        <Header />
                        <Router.Locations id="main" ref="router"
                            path={ this.props.path }>

                            <Router.Location ref="dashboard" path="/"
                                handler={ Dashboard }/>
                        </Router.Locations>
                    </div>
                    <script type="text/json"
                        id="bootstrap-data"
                        dangerouslySetInnerHTML={ json }/>
                </body>
            </html>
        );
    }
}

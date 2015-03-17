/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var App = React.createClass({
    getInitialState: function() {
        return {
            onClient: false
        };
    },

    onClick: function() {
        console.log('jidder');
        this.setState({
            onClient: true
        });
    },

    render: function() {
        var message;

        if (this.state.onClient) {
            message = (<p>Now we are on the client!</p>);
        }
        else {
            message = (
                <p>
                    Kindest regards from server-side React. <a onClick={this.onClick}>Click me!</a>
                </p>
            );
        }

        return (
            <html>
                <head>
                    <title>Hello Zetkin!</title>
                </head>
                <body>
                    <h1>Hello, Zetkin!</h1>
                    { message }
                    <script type="text/javascript" src="/static/js/main.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = App;

// Bootstrap client-side React
if (typeof window !== 'undefined') {
    window.onload = function() {
        React.render(React.createElement(App), document)
    }
}


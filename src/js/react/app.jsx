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
            <div>
                <h1>Hello, Zetkin!</h1>
                <p>{ this.props.data.foo }</p>
                { message }
            </div>
        );
    }
});

module.exports = App;

// Bootstrap client-side React
if (typeof window !== 'undefined') {
    window.onload = function() {
        var dataElement = document.getElementById('bootstrap-data');
        var data = JSON.parse(dataElement.innerText);
        var ctr = document.getElementById('ctr');
        React.render(React.createElement(App, { data: data }), ctr);
    }
}


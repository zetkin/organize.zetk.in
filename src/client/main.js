/**
 * This is the main entry point of the client-side instance of the application.
 * The server will have already rendered the HTML and prepared initial dataset
 * in the bootstrap-data script element.
*/
import cookie from 'cookie-cutter';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Z from 'zetkin';

import polyfills from '../utils/polyfills';
import App from '../components/App';
import { configureStore } from '../store';
import { subscribeToUrlChanges } from '../store/middleware/url';


window.onload = function() {
    // Configure API to use server
    Z.configure({
        host: 'api.' + process.env.ZETKIN_DOMAIN,
        port: 80,
        ssl: false
    });

    let ticket = cookie.get('apiTicket');
    if (ticket) {
        Z.setTicket(JSON.parse(ticket));
    }

    let stateElem = document.getElementById('App-initialState');
    let stateJson = stateElem.innerText || stateElem.textContent;
    let initialState = JSON.parse(stateJson);
    let store = configureStore(initialState, Z);
    let props = { initialState, }

    // Route when history state changes
    store = subscribeToUrlChanges(store);

    ReactDOM.render(React.createElement(Provider, { store: store },
        React.createElement(App, props)), document);
};

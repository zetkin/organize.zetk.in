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
import { appReducer, configureStore } from '../store';


window.onload = function() {
    // Configure API to use server
    Z.configure({
        base: '/api',
        host: location.hostname,
        port: location.port,
        ssl: false
    });

    if (cookie.get('apitoken')) {
        Z.setToken(cookie.get('apitoken'));
    }

    let stateElem = document.getElementById('App-initialState');
    let stateJson = stateElem.innerText || stateElem.textContent;
    let initialState = JSON.parse(stateJson);
    let store = configureStore(appReducer, initialState);
    let props = { initialState, }

    ReactDOM.render(React.createElement(Provider, { store: store },
        React.createElement(App, props)), document);
};

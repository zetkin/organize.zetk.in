/**
 * This is the main entry point of the client-side instance of the application.
 * The server will have already rendered the HTML and prepared initial dataset
 * in the bootstrap-data script element.
*/
import { addLocaleData } from 'react-intl';
import cookie from 'cookie-cutter';
import React from 'react';
import ReactDOM from 'react-dom';
import svLocaleData from 'react-intl/locale-data/sv';
import Z from 'zetkin';

import App from '../components/App';
import { configureStore } from '../store';
import IntlReduxProvider from '../components/IntlReduxProvider';
import polyfills from '../utils/polyfills';
import { subscribeToUrlChanges } from '../store/middleware/url';


window.onload = function() {
    Z.configure({
        host: 'api.' + process.env.ZETKIN_DOMAIN,
        port: 80,
        ssl: false
    });

    addLocaleData([
        ...svLocaleData,
    ]);

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

    ReactDOM.render(React.createElement(IntlReduxProvider, { store },
        React.createElement(App, props)), document);
};

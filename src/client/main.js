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
import daLocaleData from 'react-intl/locale-data/da';
import Z from 'zetkin';

import polyfills from '../utils/polyfills';
import App from '../components/App';
import AssignedRoutePrint from '../components/prints/AssignedRoutePrint';
import { configureStore } from '../store';
import IntlReduxProvider from '../components/IntlReduxProvider';
import { subscribeToUrlChanges } from '../store/middleware/url';


const USE_TLS = (process.env.ZETKIN_USE_TLS == '1');


window.onload = function() {
    Z.configure({
        host: 'api.' + process.env.ZETKIN_DOMAIN,
        port: USE_TLS? 443 : 80,
        ssl: USE_TLS,
    });

    addLocaleData([
        ...svLocaleData,
        ...daLocaleData,
    ]);

    let ticket = cookie.get('apiTicket');
    if (ticket) {
        Z.setTicket(JSON.parse(ticket));
    }

    let stateElem = document.getElementById('App-initialState');
    let componentName = document.body.dataset.component || 'App';
    let stateJson = stateElem.innerText || stateElem.textContent;
    let initialState = JSON.parse(stateJson);
    let store = configureStore(initialState, Z);
    let props = { initialState, }

    let Component;

    switch (componentName) {
        case 'AssignedRoutePrint':
            Component = AssignedRoutePrint;
            break;
        default:
            Component = App;
            break;
    }

    // Route when history state changes
    store = subscribeToUrlChanges(store);

    try {
        ReactDOM.render(React.createElement(IntlReduxProvider, { store },
            React.createElement(Component, props)), document);
    }
    catch (err) {
        // TODO: Report error
        const RDS = require('react-dom/server');
        window.serverHtml = document.documentElement.outerHTML;
        window.clientHtml = RDS.renderToString(React.createElement(IntlReduxProvider, { store },
            React.createElement(Component, props)), document);

        // Strip <html> and checksum
        let serverHtml = window.serverHtml
            .substr(window.serverHtml.indexOf('<body'))
            .replace(new RegExp('/>', 'g'), '>');

        let clientHtml = window.clientHtml
            .substr(window.clientHtml.indexOf('<body'))
            .replace(new RegExp('/>', 'g'), '>');

        // Find inconsistency
        let length = Math.min(serverHtml.length, clientHtml.length);
        let mismatchIndex = null;
        for (let i = 0; i < length; i++) {
            if (serverHtml[i] != clientHtml[i]) {
                mismatchIndex = i;
                break;
            }
        }

        if (mismatchIndex !== null) {
            console.warn('Server/client inconsistency near:');
            console.warn('Client: ', clientHtml.substr(mismatchIndex - 40, 80));
            console.warn('Server: ', serverHtml.substr(mismatchIndex - 40, 80));
            console.warn('Full HTML available in window.serverHtml and window.clientHtml');
            console.error(err);
        }
        else {
            console.error(err);
        }
    }
};

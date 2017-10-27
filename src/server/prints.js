import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import IntlReduxProvider from '../components/IntlReduxProvider';
import AssignedRoutePrint from '../components/prints/AssignedRoutePrint';
import { setPrintData } from '../actions/print';


const prints = express.Router();



// TODO: Generalize this to work with many printouts
prints.get('/:template/:args', (req, res) => {
    let args = req.params.args.split(',');

    if (req.params.template == 'assigned_route') {
        renderAssignedRoute(req, args)
            .then(html => {
                res.send(html);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

function renderAssignedRoute(req, args) {
    let orgId = args[0];
    let arId = args[1];

    let ar,
        assignment,
        assignee,
        route,
        routeAddresses;

    // 1. Retrieve assigned route info
    return req.z.resource('orgs', orgId, 'assigned_routes', arId).get()
        .then(result => {
            ar = result.data.data;

            // 2. Retrieve assignment info
            return req.z.resource(
                'orgs', orgId, 'canvass_assignments', ar.assignment.id).get();
        })
        .then(result => {
            assignment = result.data.data;

            // 3. Retrieve assignee info
            if (ar.canvasser) {
                return req.z.resource(
                    'orgs', orgId, 'people', ar.canvasser.id).get();
            }
            else {
                return Promise.resolve(null);
            }
        })
        .then(result => {
            assignee = result? result.data.data : result;

            // 4. Retrieve route info
            return req.z.resource('orgs', orgId,
                'canvass_routes', ar.route.id).get();
        })
        .then(result => {
            route = result.data.data;

            // 5. Retrieve route addresses
            return req.z.resource('orgs', orgId,
                'canvass_routes', route.id, 'addresses').get();
        })
        .then(result => {
            routeAddresses = result.data.data;

            req.store.dispatch(setPrintData({
                path: req.path,
                ar,
                assignment,
                assignee,
                route,
                routeAddresses,
            }));

            let PageFactory = React.createFactory(AssignedRoutePrint);
            let props = {
                initialState: req.store.getState(),
            };

            return ReactDOMServer.renderToString(
                React.createElement(IntlReduxProvider, { store: req.store },
                    PageFactory(props)));
        });
}

export default prints;

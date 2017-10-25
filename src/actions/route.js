import * as types from '.';
import makeRandomString from '../utils/makeRandomString';

const ROUTE_GEN_DEFAULTS = {
    routeSize: 100,
};


if (typeof window !== 'undefined') {
    var RouteGenWorker = require('worker-loader?inline!../workers/routegen.js');
    let worker = new RouteGenWorker();
}


export function retrieveRoutes() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ROUTES,
            payload: {
                promise: z.resource('orgs', orgId, 'canvass_routes').get(),
            },
        });
    };
}

export function retrieveRoute(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ROUTES,
            meta: { id, },
            payload: {
                promise: z.resource('orgs', orgId, 'canvass_routes', id).get(),
            },
        });
    };
}

export function retrieveAssignedRoutes() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ASSIGNED_ROUTES,
            payload: {
                promise: z.resource('orgs', orgId, 'assigned_routes').get(),
            },
        });
    };
}

export function retrieveAssignedRoute(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ASSIGNED_ROUTE,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'assigned_routes', id).get(),
            },
        });
    };
}

export function retrieveAssignedRouteStats(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ASSIGNED_ROUTE_STATS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'assigned_routes', id, 'stats').get(),
            },
        });
    };
}

export function createRoute(addressIds, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = {
            addresses: addressIds,
        };

        dispatch({
            type: types.CREATE_ROUTE,
            meta: { paneId, addressIds },
            payload: {
                promise: z.resource('orgs', orgId, 'canvass_routes').post(data),
            }
        });
    };
}

export function updateRoute(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_ROUTE,
            payload: {
                promise: z.resource('orgs', orgId,
                    'canvass_routes', id).patch(data),
            }
        });
    };
}

export function createAssignedRoute(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_ASSIGNED_ROUTE,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'assigned_routes').post(data),
            }
        });
    };
}

export function updateAssignedRoute(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_ASSIGNED_ROUTE,
            payload: {
                promise: z.resource('orgs', orgId,
                    'assigned_routes', id).patch(data),
            }
        });
    };
}

export function generateRoutes(addressIds, config = {}) {
    config = Object.assign({}, ROUTE_GEN_DEFAULTS, config);

    return ({ dispatch, getState }) => {
        let addresses = addressIds
            .map(id => getState().addresses.addressById[id]);

        let worker = new RouteGenWorker();

        worker.postMessage({ msg: 'start', config, addresses });
        worker.onmessage = ev => {
            if (ev.data.msg == 'pending') {
                let info = ev.data.info;

                dispatch({
                    type: types.GENERATE_ROUTES + '_PENDING',
                    meta: { config, info },
                });
            }
            else if (ev.data.msg == 'fulfilled') {
                let info = ev.data.info;
                let routes = ev.data.routes;

                dispatch({
                    type: types.GENERATE_ROUTES + '_FULFILLED',
                    meta: { config, info },
                    data: { routes },
                });
            }
        };
    };
}

export function discardRouteDrafts() {
    return {
        type: types.DISCARD_ROUTE_DRAFTS,
    };
}

export function commitRouteDrafts() {
    return ({ dispatch, getState }) => {
        // TODO: Don't map real data
        let routes = getState().routes.draftList.items
            .map((i, idx) => Object.assign({}, i.data, {
                id: makeRandomString(5),
            }));

        dispatch({
            type: types.COMMIT_ROUTE_DRAFTS,
            payload: {
                data: routes,
            }
        });
    };
}

import * as types from '.';


export function retrieveAddresses() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ADDRESSES,
            payload: {
                promise: z.resource('orgs', orgId, 'addresses').get(),
            },
        });
    };
}

export function retrieveRouteAddresses(routeId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_ROUTE_ADDRESSES,
            meta: { routeId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'canvass_routes', routeId, 'addresses').get(),
            },
        });
    };
}

export function addAddressesToRoute(routeId, addressIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.ADD_ADDRESSES_TO_ROUTE,
            meta: { routeId, addressIds },
            payload: {
                promise: Promise.all(addressIds.map(addrId =>
                    z.resource('orgs', orgId, 'canvass_routes', routeId,
                        'addresses', addrId).put()
                )),
            },
        });
    };
}

export function removeAddressesFromRoute(routeId, addressIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_ADDRESSES_FROM_ROUTE,
            meta: { routeId, addressIds },
            payload: {
                promise: Promise.all(addressIds.map(addrId =>
                    z.resource('orgs', orgId, 'canvass_routes', routeId,
                        'addresses', addrId).del()
                )),
            },
        });
    };
}

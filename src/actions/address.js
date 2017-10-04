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

import Z from 'zetkin';

import * as types from './';


export function createLocation(data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_LOCATION,
            payload: {
                promise: Z.resource('orgs', orgId, 'locations').post(data),
            }
        });
    };
}

export function retrieveLocations() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_LOCATIONS,
            payload: {
                promise: Z.resource('orgs', orgId, 'locations').get(),
            }
        });
    };
}

export function retrieveLocation(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_LOCATION,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'locations', id).get(),
            }
        });
    };
}

export function updateLocation(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_LOCATION,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'locations', id).patch(data),
            }
        });
    };
}

export function deleteLocation(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_LOCATION,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'locations', id).del(),
            }
        });
    };
}

export function setPendingLocation(data) {
    return {
        type: types.SET_PENDING_LOCATION,
        payload: {
            id: data.id,
            lat: data.lat,
            lng: data.lng,
        }
    };
}

export function clearPendingLocation(data) {
    return {
        type: types.CLEAR_PENDING_LOCATION,
    };
}

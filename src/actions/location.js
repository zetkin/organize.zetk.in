import * as types from './';
import makeRandomString from '../utils/makeRandomString';
import { getListItemById } from '../utils/store';


export function createLocation(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_LOCATION,
            payload: {
                promise: z.resource('orgs', orgId, 'locations').post(data),
            }
        });
    };
}

export function retrieveLocations() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_LOCATIONS,
            payload: {
                promise: z.resource('orgs', orgId, 'locations').get(),
            },
            meta: {
                recursive: false,
            },
        });
    };
}

export function retrieveLocationsRecursive() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_LOCATIONS,
            payload: {
                promise: z.resource('orgs', orgId, 'locations?recursive').get(),
            },
            meta: {
                recursive: true,
            },
        });
    };
}

export function retrieveLocation(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_LOCATION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'locations', id).get(),
            }
        });
    };
}

export function updateLocation(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_LOCATION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'locations', id).patch(data),
            }
        });
    };
}

export function deleteLocation(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_LOCATION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'locations', id).del(),
            }
        });
    };
}

export function createPendingLocation(position, doneCallback) {
    let id = '$' + makeRandomString(6);

    return {
        type: types.CREATE_PENDING_LOCATION,
        payload: { id, position, doneCallback },
    };
}

export function savePendingLocation(id, position) {
    return {
        type: types.SAVE_PENDING_LOCATION,
        payload: { id, position },
    };
}

export function finishPendingLocation(id) {
    return ({ dispatch, getState }) => {
        let pendingLocationList = getState().locations.pendingLocationList;
        let pendingLocation = getListItemById(pendingLocationList, id);
        let position = pendingLocation.data.position;

        pendingLocation.data.doneCallback(position);

        dispatch({
            type: types.FINISH_PENDING_LOCATION,
            payload: { id, position }
        });
    };
}

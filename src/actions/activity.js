import Z from 'zetkin'
import * as types from '.';


export function createActivity(data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_ACTIVITY,
            payload: {
                promise: Z.resource('orgs', orgId, 'activities').post(data),
            }
        });
    };
}

export function retrieveActivities() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTIVITIES,
            payload: {
                promise: Z.resource('orgs', orgId, 'activities').get(),
            }
        });
    };
}

export function retrieveActivity(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTIVITY,
            payload: {
                promise: Z.resource('orgs', orgId, 'activities', id).get(),
            }
        });
    };
}

export function updateActivity(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_ACTIVITY,
            meta: { id },
            payload: {
                promise: Z.resource(
                    'orgs', orgId, 'activities', id).patch(data),
            }
        });
    };
}

export function deleteActivity(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_ACTIVITY,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'activities', id).del(),
            }
        });
    };
}

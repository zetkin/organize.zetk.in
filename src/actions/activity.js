import * as types from '.';


export function createActivity(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_ACTIVITY,
            payload: {
                promise: z.resource('orgs', orgId, 'activities').post(data),
            }
        });
    };
}

export function retrieveActivities() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTIVITIES,
            payload: {
                promise: z.resource('orgs', orgId, 'activities').get(),
            }
        });
    };
}

export function retrieveActivity(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTIVITY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'activities', id).get(),
            }
        });
    };
}

export function updateActivity(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_ACTIVITY,
            meta: { id },
            payload: {
                promise: z.resource(
                    'orgs', orgId, 'activities', id).patch(data),
            }
        });
    };
}

export function deleteActivity(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_ACTIVITY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'activities', id).del(),
            }
        });
    };
}

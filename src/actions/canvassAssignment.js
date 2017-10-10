import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function retrieveCanvassAssignment(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CANVASS_ASSIGNMENT,
            payload: {
                promise: z.resource('orgs', orgId,
                    'canvass_assignments', id).get(),
            }
        });
    };
}

export function retrieveCanvassAssignments() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CANVASS_ASSIGNMENTS,
            payload: {
                promise: z.resource('orgs', orgId,
                    'canvass_assignments').get(),
            }
        });
    };
}

export function createCanvassAssignment(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_CANVASS_ASSIGNMENT,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId, 'canvass_assignments')
                    .post(data)
            }
        });
    };
}

export function updateCanvassAssignment(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_CANVASS_ASSIGNMENT,
            payload: {
                promise: z.resource('orgs', orgId, 'canvass_assignments', id)
                    .patch(data),
            },
        });
    };
}

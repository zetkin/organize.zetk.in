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

export function retrieveCanvassAssignmentRoutes(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CANVASS_ASSIGNMENT_ROUTES,
            meta: {
                assignmentId: id
            },
            payload: {
                promise: z.resource('orgs', orgId,
                    'canvass_assignments', id, 'routes').get(),
            }
        });
    }
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

export function addRoutesToCanvassAssignment(id, routeIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.ADD_ROUTES_TO_CANVASS_ASSIGNMENT,
            meta: { id, routeIds },
            payload: {
                promise: Promise.all(routeIds.map(routeId =>
                    z.resource('orgs', orgId, 'canvass_assignments', id,
                        'routes', routeId).put()
                )),
            },
        });
    };
}

export function removeRoutesFromCanvassAssignment(id, routeIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_ROUTES_FROM_CANVASS_ASSIGNMENT,
            meta: { id, routeIds },
            payload: {
                promise: Promise.all(routeIds.map(routeId =>
                    z.resource('orgs', orgId, 'canvass_assignments', id,
                        'routes', routeId).del()
                )),
            },
        });
    };
}

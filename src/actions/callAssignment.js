import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function createCallAssignment(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_CALL_ASSIGNMENT,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments').post(data)
            },
        });
    };
}

export function retrieveCallAssignments() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENTS,
            payload: {
                promise: z.resource('orgs', orgId, 'call_assignments').get(),
            },
        });
    };
}

export function retrieveCallAssignment(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'call_assignments', id).get()
            }
        });
    };
}

export function retrieveCallAssignmentStats(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT_STATS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', id, 'stats').get()
            }
        });
    };
}

export function retrieveCallAssignmentTargets(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT_TARGETS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', id, 'targets').get()
            }
        });
    };
}

export function updateCallAssignment(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_CALL_ASSIGNMENT,
            payload: {
                promise: z.resource(
                    'orgs', orgId, 'call_assignments', id).patch(data),
            },
        });
    }
}

export function deleteCallAssignment(assignmentId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_CALL_ASSIGNMENT,
            meta: { assignmentId },
            payload: {
                promise: z.resource(
                    'orgs', orgId, 'call_assignments', assignmentId).del()
            },
        });
    }
}

export function retrieveCallAssignmentCallers(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT_CALLERS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'call_assignments', id,
                    'callers').get(),
            }
        });
    };
}

export function addCallAssignmentCallers(id, callerIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = callerIds.map(callerId => z.resource('orgs', orgId,
            'call_assignments', id, 'callers', callerId).put());

        dispatch({
            type: types.ADD_CALL_ASSIGNMENT_CALLERS,
            meta: { id, callerIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
};

export function removeCallAssignmentCaller(id, callerId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_CALL_ASSIGNMENT_CALLER,
            meta: { id, callerId },
            payload: {
                promise: z.resource('orgs', orgId, 'call_assignments', id,
                    'callers', callerId).del(),
            }
        });
    }
}

export function addCallerPrioritizedTags(assignmentId, callerId, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => z.resource('orgs', orgId,
            'call_assignments', assignmentId, 'callers', callerId,
            'prioritized_tags', tagId).put());

        dispatch({
            type: types.ADD_CALLER_PRIORITIZED_TAGS,
            meta: { assignmentId, callerId, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

export function removeCallerPrioritizedTags(assignmentId, callerId, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => z.resource('orgs', orgId,
            'call_assignments', assignmentId, 'callers', callerId,
            'prioritized_tags', tagId).del());

        dispatch({
            type: types.REMOVE_CALLER_PRIORITIZED_TAGS,
            meta: { assignmentId, callerId, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

export function addCallerExcludedTags(assignmentId, callerId, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => z.resource('orgs', orgId,
            'call_assignments', assignmentId, 'callers', callerId,
            'excluded_tags', tagId).put());

        dispatch({
            type: types.ADD_CALLER_EXCLUDED_TAGS,
            meta: { assignmentId, callerId, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

export function removeCallerExcludedTags(assignmentId, callerId, tagIds) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => z.resource('orgs', orgId,
            'call_assignments', assignmentId, 'callers', callerId,
            'excluded_tags', tagId).del());

        dispatch({
            type: types.REMOVE_CALLER_EXCLUDED_TAGS,
            meta: { assignmentId, callerId, tagIds },
            payload: {
                promise: Promise.all(promises),
            }
        });
    };
}

import Z from 'zetkin';

import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function retrieveCallAssignments() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENTS,
            payload: {
                promise: Z.resource('orgs', orgId, 'call_assignments').get(),
            },
        });
    };
}

export function retrieveCallAssignment(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'call_assignments', id).get()
            }
        });
    };
}

export function updateCallAssignment(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_CALL_ASSIGNMENT,
            payload: {
                promise: Z.resource(
                    'orgs', orgId, 'call_assignments', id).patch(data),
            },
        });
    }
}

export function retrieveCallAssignmentCallers(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL_ASSIGNMENT_CALLERS,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'call_assignments', id,
                    'callers').get(),
            }
        });
    };
}

export function addCallAssignmentCallers(id, callerIds) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = callerIds.map(callerId => Z.resource('orgs', orgId,
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

export function addCallerPrioritizedTags(assignmentId, callerId, tagIds) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => Z.resource('orgs', orgId,
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
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => Z.resource('orgs', orgId,
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
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => Z.resource('orgs', orgId,
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
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        let promises = tagIds.map(tagId => Z.resource('orgs', orgId,
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

export function createCallAssignmentDraft(type, config) {
    let assignment = {
        // Prepend ID with $ to designate draft
        id: '$' + makeRandomString(6),
        filter_spec: [],
    };

    // TODO: Improve these suggestions
    switch (type) {
        case 'stayintouch':
            assignment.title = 'Stay in touch';
            assignment.description = 'Stay in touch every ' +
                config.interval + ' months';
            break;

        case 'inform':
            assignment.title = 'Inform';
            assignment.description = '(No description)';
            break;

        case 'mobilize':
            assignment.title = config.campaign.title;
            assignment.description = 'Mobilize activists for campaign "' +
                config.campaign.title + '"';
            break;

        case 'survey':
            // TODO: Implement this
            break;
    }

    return {
        type: types.CREATE_CALL_ASSIGNMENT_DRAFT,
        payload: { assignment },
    };
}

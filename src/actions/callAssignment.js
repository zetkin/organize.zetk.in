import Z from 'zetkin';

import * as types from '.';
import makeRandomString from '../utils/makeRandomString';


export function createCallAssignment(data, draftId) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_CALL_ASSIGNMENT,
            meta: { draftId },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'call_assignments').post(data)
            },
        });
    };
}

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

export function removeCallAssignmentCaller(id, callerId) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_CALL_ASSIGNMENT_CALLER,
            meta: { id, callerId },
            payload: {
                promise: Z.resource('orgs', orgId, 'call_assignments', id,
                    'callers', callerId).del(),
            }
        });
    }
}

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
    // Prepend ID with $ to denote draft
    let id = '$' + makeRandomString(6);
    let title = '';
    let description = '';
    let startDate = Date.utc.create();
    let endDate = (30).daysAfter(startDate);
    let targetFilters = [];
    let goalFilters = [];

    switch (type) {
        case 'stayintouch':
            let months = Math.round(config.interval/30);
            title = 'Stay in touch';
            description = 'Stay in touch every ' + months + ' months';

            // Add filter to find people who have not been contacted in the
            // selected number of months.
            goalFilters.push({
                type: 'call_history',
                config: {
                    operator: 'notreached',
                    after: '-' + config.interval + 'd',
                }
            });
            break;

        case 'inform':
            title = 'Inform';
            description = '(No description)';

            // Add filter to find all who have not already been reached in this
            // particular call assignment. The $self expression is replaced by
            // the API with the ID of the newly created assignment.
            goalFilters.push({
                type: 'call_history',
                config: {
                    operator: 'notreached',
                    assignment: '$self',
                }
            });
            break;

        case 'mobilize':
            title = 'Mobilize: ' + config.campaign.title;
            description = 'Mobilize activists for campaign "' +
                config.campaign.title + '"';

            // Add filter to find all who do not have future bookings
            // in the concerned campaign.
            goalFilters.push({
                type: 'campaign_participation',
                config: {
                    operator: 'notin',
                    campaign: config.campaign.id,
                    after: 'now',
                }
            });
            break;

        case 'survey':
            // TODO: Implement this
            break;
    }

    let assignment = {
        id, title, description,
        start_date: startDate.format('{yyyy}-{MM}-{dd}'),
        end_date: endDate.format('{yyyy}-{MM}-{dd}'),
        target_filters: targetFilters,
        goal_filters: goalFilters,
        cooldown: 3,
    };

    return {
        type: types.CREATE_CALL_ASSIGNMENT_DRAFT,
        payload: { assignment },
    };
}

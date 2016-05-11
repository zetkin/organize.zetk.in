import Z from 'zetkin';

import * as types from '.';


export function retrieveActions() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTIONS,
            payload: {
                promise: Z.resource('orgs', orgId, 'actions').get()
            }
        });
    };
}

export function retrieveAction(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTION,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'actions', id).get()
            }
        });
    };
}

export function updateAction(id, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_ACTION,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'actions', id).patch(data)
            }
        });
    };
}

export function createAction(campaignId, data) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_ACTION,
            meta: { campaignId },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'campaigns', campaignId, 'actions').post(data)
            }
        });
    }
}

export function sendActionReminders(actionId) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.SEND_ACTION_REMINDERS,
            meta: { actionId },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'actions', actionId, 'reminders').post()
            }
        });
    };
}

export function highlightActions(actionIds) {
    return {
        type: types.HIGHLIGHT_ACTIONS,
        payload: actionIds
    }
}

export function clearActionHighlights() {
    return {
        type: types.CLEAR_ACTION_HIGHLIGHTS,
    };
}

export function highlightActionActivity(activityId) {
    return {
        type: types.HIGHLIGHT_ACTION_ACTIVITY,
        payload: { activityId }
    }
}

export function highlightActionLocation(locationId) {
    return {
        type: types.HIGHLIGHT_ACTION_LOCATION,
        payload: { locationId }
    }
}

export function highlightActionActivityPhase(activityId, phase) {
    return {
        type: types.HIGHLIGHT_ACTION_ACTIVITY_PHASE,
        payload: { activityId, phase }
    }
}

export function highlightActionLocationPhase(locationId, phase) {
    return {
        type: types.HIGHLIGHT_ACTION_LOCATION_PHASE,
        payload: { locationId, phase }
    }
}

import * as types from '.';


export function retrieveActions(afterDate, beforeDate) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        let filters = [];

        afterDate = afterDate || getState().actions.filters.afterDate;
        beforeDate = beforeDate || getState().actions.filters.beforeDate;

        if (afterDate) {
            filters.push(['start_time', '>', afterDate]);
        }

        if (beforeDate) {
            // Add one day to beforeDate, to include all actions
            // on that day
            let beforeDateNext = Date
                .create(beforeDate)
                .addDays(1)
                .format('{yyyy}-{MM}-{dd}');

            filters.push(['start_time', '<', beforeDateNext]);
        }

        dispatch({
            type: types.RETRIEVE_ACTIONS,
            meta: { afterDate, beforeDate },
            payload: {
                promise: z.resource('orgs', orgId, 'actions').get(
                    null, null, filters),
            }
        });
    };
}

export function retrieveActionsOnDay(date) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        // Add one day to beforeDate, to include all actions
        // on that day
        let beforeDateNext = Date
            .create(date)
            .addDays(1)
            .format('{yyyy}-{MM}-{dd}');

        let filters = [
            ['start_time', '>', date],
            ['end_time', '<', beforeDateNext],
        ];

        dispatch({
            type: types.RETRIEVE_ACTIONS_ON_DAY,
            meta: { date },
            payload: {
                promise: z.resource('orgs', orgId, 'actions').get(
                    null, null, filters),
            }
        });
    };
}

export function retrieveAction(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'actions', id).get()
            }
        });
    };
}

export function updateAction(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_ACTION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'actions', id).patch(data)
            }
        });
    };
}

export function createAction(campaignId, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_ACTION,
            meta: { campaignId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'campaigns', campaignId, 'actions').post(data)
            }
        });
    }
}

export function deleteAction(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_ACTION,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'actions', id).del()
            }
        });
    }
}

export function setActionContact(actionId, contactId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = { contact_id: contactId };
        let promise = new Promise((resolve, reject) => {
            let participant = null;

            z.resource('orgs', orgId,
                'actions', actionId, 'participants', contactId)
                .put()
                .then(res => {
                    participant = res.data.data;
                    return z.resource('orgs', orgId, 'actions', actionId)
                        .patch(data)
                })
                .then(res => {
                    resolve({
                        participant,
                        action: res.data.data,
                    });
                })
                .catch(err => reject(err));
        });

        dispatch({
            type: types.SET_ACTION_CONTACT,
            meta: { actionId, contactId },
            payload: { promise },
        });
    };
}

export function sendActionReminders(actionId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.SEND_ACTION_REMINDERS,
            meta: { actionId },
            payload: {
                promise: z.resource('orgs', orgId,
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

import {
    createList,
    createListItems,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem,
} from '../utils/store';
import * as types from '../actions';

export const filteredActionList = state => {
    let selectedCampaign = state.campaigns.selectedCampaign;

    if (!selectedCampaign) {
        return state.actions.actionList;
    }

    return Object.assign({}, state.actions.actionList, {
        items: state.actions.actionList.items.filter(i =>
            i.data.campaign && i.data.campaign.id === selectedCampaign),
    });
};


export default function actions(state = null, action) {
    let actionData;

    switch (action.type) {
        case types.RETRIEVE_ACTIONS + '_PENDING':
            return Object.assign({}, state, {
                filters: {
                    activity: action.meta.activity,
                    afterDate: action.meta.afterDate,
                    beforeDate: action.meta.beforeDate,
                },
                actionList: Object.assign({}, state.actionList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_ACTIONS + '_FULFILLED':
            return Object.assign({}, state, {
                actionList: createList(action.payload.data.data),
            });

        case types.RETRIEVE_ACTIONS_ON_DAY + '_FULFILLED':
            return Object.assign({}, state, {
                actionList: updateOrAddListItems(state.actionList,
                    action.payload.data.data),
            });

        case types.RETRIEVE_ACTIONS + '_REJECTED':
            return Object.assign({}, state, {
                actionList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_ACTION + '_PENDING':
            actionData = { id: action.meta.id };
            return Object.assign({}, state, {
                actionList: updateOrAddListItem(state.actionList,
                        actionData.id, actionData, { isPending: true }),
            });

        case types.SET_ACTION_CONTACT + '_FULFILLED':
            actionData = action.payload.action;
            return Object.assign({}, state, {
                actionList: updateOrAddListItem(state.actionList,
                    actionData.id, actionData, { isPending: false, error: null }),
            });

        case types.CREATE_ACTION + '_FULFILLED':
        case types.UPDATE_ACTION + '_FULFILLED':
        case types.RETRIEVE_ACTION + '_FULFILLED':
            actionData = action.payload.data.data
            return Object.assign({}, state, {
                actionList: updateOrAddListItem(state.actionList,
                    actionData.id, actionData, { isPending: false, error: null }),
            });

        case types.DELETE_ACTION + '_FULFILLED':
            return Object.assign({}, state, {
                actionList: removeListItem(state.actionList,
                    action.meta.id, { pending: false, error: null }),
            });

        case types.HIGHLIGHT_ACTION_ACTIVITY:
            return toggleActionHighlights(state, action, (a, p) =>
                a.activity.id == p.activityId);

        case types.HIGHLIGHT_ACTION_ACTIVITY_PHASE:
            return toggleActionHighlights(state, action, (a, p) =>
                a.activity.id == p.activityId && actionIsPhase(a, p.phase));

        case types.HIGHLIGHT_ACTION_LOCATION:
            return toggleActionHighlights(state, action, (a, p) =>
                a.location.id == p.locationId);

        case types.HIGHLIGHT_ACTION_LOCATION_PHASE:
            return toggleActionHighlights(state, action, (a, p) =>
                a.location.id == p.locationId && actionIsPhase(a, p.phase));

        case types.CLEAR_ACTION_HIGHLIGHTS:
            return toggleActionHighlights(state, action, (a, p) => false);

        case types.SELECT_CAMPAIGN:
            return Object.assign({}, state, {
                filters: {
                    afterDate: null,
                    beforeDate: null,
                },
            });

        case types.SEND_ACTION_REMINDERS + '_PENDING':
            return Object.assign({}, state, {
                actionList: updateOrAddListItem(state.actionList,
                        action.meta.actionId, {}, { isReminderPending: true }),
            });

        case types.SEND_ACTION_REMINDERS + '_FULFILLED':
            return Object.assign({}, state, {
                actionList: updateOrAddListItem(state.actionList,
                        action.meta.actionId, {}, { isReminderPending: false }),
            });

        default:
            // By default, filter from last week and eight weeks forward
            let startDate = Date.create('last monday');
            return state || {
                filters: {
                    afterDate: startDate.format('{yyyy}-{MM}-{dd}'),
                    beforeDate: null,
                    activity: null,
                },
                actionList: null,
            };
    }
}

function toggleActionHighlights(state, action, cmp) {
    return Object.assign({}, state, {
        actionList: Object.assign({}, state.actionList, {
            items: state.actionList.items.map(i => {
                let hl = cmp(i.data, action.payload)
                return (hl == i.data.highlight)? i : Object.assign({}, i, {
                    data: Object.assign({}, i.data, {
                        highlight: hl,
                    }),
                });
            }),
        }),
    });
}

function actionIsPhase(action, phase) {
    // TODO: Don't duplicate these constants in ActionLocationItem component
    const startTime = new Date(action.start_time);
    const hour = startTime.getUTCHours();

    if (hour <= 4 || hour > 22) {
        return phase == 4;
    }
    else if (hour <= 9) {
        return phase == 0;
    }
    else if (hour <= 13) {
        return phase == 1;
    }
    else if (hour <= 17) {
        return phase == 2;
    }
    else if (hour <= 22) {
        return phase == 3;
    }
}

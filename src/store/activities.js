import {
    createList,
    createListItems,
    updateOrAddListItem,
    removeListItem,
} from '../utils/store';
import * as types from '../actions';


export default function activities(state = null, action) {
    let activity;

    switch (action.type) {
        case types.RETRIEVE_ACTIVITIES + '_PENDING':
            return Object.assign({}, state, {
                activityList: Object.assign({}, state.activityList, {
                    isPending: true,
                    error:null,
                })
            });

        case types.RETRIEVE_ACTIVITIES + '_FULFILLED':
            return Object.assign({}, state, {
                activityList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_ACTIVITIES + '_REJECTED':
            return Object.assign({}, state, {
                activityList: {
                    isPending: false,
                    error: action.payload,
                }
            });

        case types.RETRIEVE_ACTIVITY + '_PENDING':
            activity = { id: action.meta.id };
            return Object.assign({}, state, {
                activityList: updateOrAddListItem(state.activityList,
                        activity.id, activity, { pending: true }),
            });

        case types.CREATE_ACTIVITY + '_FULFILLED':
        case types.UPDATE_ACTIVITY + '_FULFILLED':
        case types.RETRIEVE_ACTIVITY + '_FULFILLED':
            activity = action.payload.data.data
            return Object.assign({}, state, {
                activityList: updateOrAddListItem(state.activityList,
                    activity.id, activity, { pending: false, error: null }),
            });

        case types.DELETE_ACTIVITY + '_FULFILLED':
            return Object.assign({}, state, {
                activityList: removeListItem(state.activityList,
                    action.meta.id, { pending: false, error: null }),
            });

        default:
            return state || {
                activityList: createList(),
            };
    }
}

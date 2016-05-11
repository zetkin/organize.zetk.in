import {
    createList, createListItems,
    updateOrAddListItem, removeListItem } from '../utils/store';
import {
    CREATE_LOCATION,
    RETRIEVE_LOCATIONS,
    RETRIEVE_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION,
    SET_PENDING_LOCATION,
    CLEAR_PENDING_LOCATION
} from '../actions';

export default function locations(state = null, action) {
    let loc;

    switch (action.type) {
        case RETRIEVE_LOCATIONS + '_PENDING':
            return Object.assign({}, state, {
                locationList: Object.assign({}, state.locationList, {
                    isPending: true,
                    error: null,
                }),
            });

        case RETRIEVE_LOCATIONS + '_FULFILLED':
            return Object.assign({}, state, {
                locationList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data),
                },
            });

        case RETRIEVE_LOCATIONS + '_REJECTED':
            return Object.assign({}, state, {
                locationList: {
                    isPending: false,
                    error: action.payload,
                },
            });

        case CREATE_LOCATION + '_FULFILLED':
        case UPDATE_LOCATION + '_FULFILLED':
        case RETRIEVE_LOCATION + '_FULFILLED':
            loc = action.payload.data.data;
            return Object.assign({}, state, {
                locationList: updateOrAddListItem(state.locationList,
                    loc.id, loc, { pending: false, error: null }),
            });

        case DELETE_LOCATION + '_FULFILLED':
            return Object.assign({}, state, {
                locationList: removeListItem(state.locationList,
                    action.meta.id),
            });

        case SET_PENDING_LOCATION:
            return Object.assign({}, state, {
                pendingLocation: Object.assign({}, action.payload),
            });

        case CLEAR_PENDING_LOCATION:
            return Object.assign({}, state, {
                pendingLocation: false,
            });

        default:
            return state || {
                locationList: createList(),
                pendingLocation: false,
            };
    }
}

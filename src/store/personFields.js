import {
    createList,
    createListItems,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';

import * as types from '../actions';


export default function personFields(state = null, action) {
    if (action.type == types.RETRIEVE_FIELDS_FOR_PERSON + '_PENDING') {
        return Object.assign({}, state, {
            valuesByPerson: Object.assign({}, state.valuesByPerson, {
                [action.meta.id]: createList(null, { isPending: true }),
            }),
        });
    }
    else if (action.type == types.RETRIEVE_FIELDS_FOR_PERSON + '_REJECTED') {
        return Object.assign({}, state, {
            valuesByPerson: Object.assign({}, state.valuesByPerson, {
                [action.meta.id]: createList(null, { error: action.payload.data }),
            }),
        });
    }
    else if (action.type == types.RETRIEVE_FIELDS_FOR_PERSON + '_FULFILLED') {
        return Object.assign({}, state, {
            valuesByPerson: Object.assign({}, state.valuesByPerson, {
                [action.meta.id]: createList(action.payload.data.data),
            }),
        });
    }
    else {
        return state || {
            valuesByPerson: {},
        };
    }
}

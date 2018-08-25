import * as types from '../actions';

import { createList } from '../utils/store';


export default function timelines(state = null, action) {
    if (action.type == types.RETRIEVE_PERSON_TIMELINE + '_PENDING') {
        return Object.assign({}, state, {
            byPerson: Object.assign({}, state.byPerson, {
                [action.meta.personId]: createList([], { isPending: true }),
            }),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_TIMELINE + '_REJECTED') {
        return Object.assign({}, state, {
            byPerson: Object.assign({}, state.byPerson, {
                [action.meta.personId]: Object.assign({}, state.byPerson[action.meta.personId], {
                    isPending: true,
                    error: action.payload.data,
                }),
            }),
        });
    }
    else if (action.type == types.RETRIEVE_PERSON_TIMELINE + '_FULFILLED') {
        return Object.assign({}, state, {
            byPerson: Object.assign({}, state.byPerson, {
                [action.meta.personId]: createList(action.payload.data.data),
            }),
        });
    }
    else {
        return state || {
            byPerson: {},
        };
    }
}

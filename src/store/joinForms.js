import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function joinForms(state = null, action) {
    if (action.type == types.RETRIEVE_JOIN_SUBMISSIONS + '_FULFILLED') {
        return Object.assign({}, state, {
            submissionList: createList(action.payload.data.data),
        });
    }
    else if (action.type == types.RETRIEVE_JOIN_SUBMISSION + '_FULFILLED') {
        const sub = action.payload.data.data;
        return Object.assign({}, state, {
            submissionList: updateOrAddListItem(state.submissionList, sub.id, sub),
        });
    }
    else {
        return state || {
            formList: createList(),
            submissionList: createList(),
        };
    }
}

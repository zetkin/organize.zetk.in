import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function personTags(state = null, action) {
    if (action.type == types.RETRIEVE_JOIN_SUBMISSIONS + '_FULFILLED') {
        return Object.assign({}, state, {
            submissionList: createList(action.payload.data.data),
        });
    }
    else {
        return state || {
            formList: createList(),
            submissionList: createList(),
        };
    }
}

import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function personViews(state = null, action) {
    if (action.type == types.RETRIEVE_PERSON_VIEWS + '_FULFILLED') {
        return Object.assign({}, state, {
            viewList: createList(action.payload.data.data),
        });
    }
    else {
        return state || {
            viewList: createList(),
            columnsByView: {},
            rowsByView: {},
        };
    }
}

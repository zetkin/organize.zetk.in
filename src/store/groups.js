import * as types from '../actions';

import {
    createList,
    updateOrAddListItem,
} from '../utils/store';


export default function groups(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_GROUPS + '_FULFILLED':
            return Object.assign({}, state, {
                groupList: createList(action.payload.data.data),
            });

        case types.RETRIEVE_GROUP + '_FULFILLED':
            let group = action.payload.data.data;
            return Object.assign({}, state, {
                groupList: updateOrAddListItem(state.groupList,
                    group.id, group)
            });

        default:
            return state || {
                groupList: createList()
            };
    }
}

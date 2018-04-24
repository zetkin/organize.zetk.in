import * as types from '../actions';

import { createList } from '../utils/store';


export default function groups(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_GROUPS + '_FULFILLED':
            return Object.assign({}, state, {
                groupList: createList(action.payload.data.data),
            });

        default:
            return state || {
                groupList: createList()
            };
    }
}

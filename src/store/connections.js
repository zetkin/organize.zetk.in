import {
    createList,
    removeListItem,
    updateOrAddListItem,
} from '../utils/store';

import * as types from '../actions';

export default function connections(state = null, action) {
    const type = action.type;
    if (type === types.RETRIEVE_CONNECTIONS + '_FULFILLED') {
        const personId = action.meta.person;
        const conns = action.payload.data.data;
        return Object.assign({}, state, {
            connectionList: updateOrAddListItem(state.connectionList,
                personId, conns, { isPending: false, error: null }),
        });
    }
    else if (type === types.DELETE_CONNECTION + '_FULFILLED') {
        return Object.assign({}, state, {
            connectionList: removeListItem(state.connectionList, action.meta.person),
        });
    }
    else {
        return state || {
            connectionList: createList(),
        };
    }
}

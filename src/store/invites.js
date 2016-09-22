import * as types from '../actions';
import {
    createList,
    createListItems
} from '../utils/store';


export default function invites(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_INVITES + '_PENDING':
            return Object.assign({}, state, {
                inviteList: Object.assign({}, state.inviteList, {
                    isPending: true,
                    error: null,
                })
            });

        case types.RETRIEVE_INVITES + '_FULFILLED':
            return Object.assign({}, state, {
                inviteList: Object.assign({}, state.inviteList, {
                    isPending: false,
                    items: createListItems(action.payload.data.data)
                })
            });

        default:
            return state || {
                inviteList: createList()
            };
    }
}

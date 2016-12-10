import * as types from '../actions';
import {
    createList,
    createListItems,
    removeListItem,
    updateOrAddListItem,
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

        case types.CREATE_INVITE + '_PENDING':
            return Object.assign({}, state, {
                createIsPending: true,
            });

        case types.CREATE_INVITE + '_FULFILLED':
            let invite = action.payload.data.data;
            return Object.assign({}, state, {
                createIsPending: false,
                inviteList: updateOrAddListItem(state.inviteList,
                    invite.id, invite)
            });

        case types.CREATE_INVITE + '_REJECTED':
            return Object.assign({}, state, {
                createIsPending: false,
                createError: Object.assign({}, action.payload.data, {
                    email: action.meta.email,
                })
            });

        case types.DELETE_INVITE + '_FULFILLED':
            return Object.assign({}, state, {
                inviteList: removeListItem(state.inviteList, action.meta.id)
            });

        default:
            return state || {
                inviteList: createList()
            };
    }
}

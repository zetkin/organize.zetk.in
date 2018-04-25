import * as types from '../actions';

import {
    createList,
    removeListItem,
    updateOrAddListItem,
} from '../utils/store';


export default function groups(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_GROUPS + '_FULFILLED':
            return Object.assign({}, state, {
                groupList: createList(action.payload.data.data),
            });

        case types.CREATE_GROUP + '_FULFILLED':
        case types.UPDATE_GROUP + '_FULFILLED':
        case types.RETRIEVE_GROUP + '_FULFILLED':
            let group = action.payload.data.data;
            return Object.assign({}, state, {
                groupList: updateOrAddListItem(state.groupList,
                    group.id, group)
            });

        case types.DELETE_GROUP + '_FULFILLED':
            return Object.assign({}, state, {
                groupList: removeListItem(state.groupList, action.meta.id),
            });

        case types.RETRIEVE_GROUP_MEMBERS + '_PENDING':
            return Object.assign({}, state, {
                membersByGroup: Object.assign({}, state.membersByGroup, {
                    [action.meta.id]: createList(null, { isPending: true }),
                }),
            });

        case types.RETRIEVE_GROUP_MEMBERS + '_FULFILLED':
            return Object.assign({}, state, {
                membersByGroup: Object.assign({}, state.membersByGroup, {
                    [action.meta.id]: createList(action.payload.data.data),
                }),
            });

        case types.ADD_GROUP_MEMBER + '_FULFILLED':
        case types.PROMOTE_GROUP_MANAGER + '_FULFILLED':
        case types.DEMOTE_GROUP_MANAGER + '_FULFILLED':
            let memberList = state.membersByGroup[action.meta.groupId] || createList();
            return Object.assign({}, state, {
                membersByGroup: Object.assign({}, state.membersByGroup, {
                    [action.meta.groupId]: updateOrAddListItem(memberList,
                        action.meta.personId, action.payload.data.data),
                }),
            });

        case types.REMOVE_GROUP_MEMBER + '_FULFILLED':
            return Object.assign({}, state, {
                membersByGroup: Object.assign({}, state.membersByGroup, {
                    [action.meta.groupId]: removeListItem(
                        state.membersByGroup[action.meta.groupId], action.meta.personId),
                }),
            });

        default:
            return state || {
                groupList: createList(),
                membersByGroup: {},
            };
    }
}

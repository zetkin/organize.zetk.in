import * as types from '../actions';
import {
    createList,
    createListItems,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function officials(state = null, action) {
    switch (action.type) {
        case types.RETRIEVE_OFFICIALS + '_PENDING':
            return Object.assign({}, state, {
                officialList: Object.assign({}, state.officialList, {
                    isPending: true,
                    error: null,
                })
            });

        case types.RETRIEVE_OFFICIALS + '_FULFILLED':
            return Object.assign({}, state, {
                officialList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_OFFICIALS + '_REJECTED':
            return Object.assign({}, state, {
                officialList: {
                    isPending: false,
                    error: action.payload,
                    items: [],
                }
            });

        case types.SET_OFFICIAL_ROLE + '_PENDING':
            if (getListItemById(state.officialList, action.meta.id)) {
                return Object.assign({}, state, {
                    officialList: updateOrAddListItem(state.officialList,
                        action.meta.personId, { role: action.meta.role })
                });
            }
            else {
                return state;
            }

        case types.SET_OFFICIAL_ROLE + '_FULFILLED':
            let official = action.payload.data.data;
            return Object.assign({}, state, {
                officialList: updateOrAddListItem(state.officialList,
                    official.id, official)
            });

        case types.SET_OFFICIALS_ROLE + '_FULFILLED':
            let officials = action.payload.map(d => d.data.data);
            return Object.assign({}, state, {
                officialList: updateOrAddListItems(
                    state.officialList, officials)
            });

        case types.DELETE_OFFICIAL + '_FULFILLED':
            return Object.assign({}, state, {
                officialList: removeListItem(state.officialList,
                    action.meta.personId)
            });

        default:
            return state || {
                officialList: createList(),
            };
    }
}

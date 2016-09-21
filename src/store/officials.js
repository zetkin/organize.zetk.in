import { createList, createListItems } from '../utils/store';
import * as types from '../actions';

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

        default:
            return state || {
                officialList: createList(),
            };
    }
}

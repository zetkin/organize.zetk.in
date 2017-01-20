import * as types from '../actions';
import { createList, updateOrAddListItem } from '../utils/store';


export default function calls(state = null, action) {
    let call;

    switch(action.type) {
        case types.RETRIEVE_CALLS + '_PENDING':
            return Object.assign({
                callList: createList(null, { isPending: true })
            });

        case types.RETRIEVE_CALLS + '_FULFILLED':
            return Object.assign({
                callList: createList(action.payload.data.data,
                    { isPending: false })
            });

        case types.RETRIEVE_CALL + '_PENDING':
            return Object.assign({
                callList: updateOrAddListItem(state.callList,
                    action.meta.id, null, { isPending: true }),
            });

        case types.RETRIEVE_CALL + '_FULFILLED':
            call = action.payload.data.data;
            return Object.assign({
                callList: updateOrAddListItem(state.callList,
                    call.id, call, { isPending: false, error: null }),
            });

        case types.TOGGLE_CALL_ACTION_TAKEN + '_FULFILLED':
            call = action.payload.data.data;
            return Object.assign({
                callList: updateOrAddListItem(state.callList,
                    call.id, call, { isPending: false, error: null }),
            });

        default:
            return state || {
                callList: createList(),
            };
    }
}

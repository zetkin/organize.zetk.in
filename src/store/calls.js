import * as types from '../actions';
import { createList } from '../utils/store';


export default function calls(state = null, action) {
    switch(action.type) {
        case types.RETRIEVE_CALLS + '_PENDING':
            return Object.assign({
                callList: createList(null, { isPending: true })
            });

        case types.RETRIEVE_CALLS + '_FULFILLED':
            return Object.assign({
                callList: createList(action.payload.data.data, { isPending: false })
            });

        default:
            return state || {
                callList: createList(),
            };
    }
}

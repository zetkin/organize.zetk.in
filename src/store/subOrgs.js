import * as types from '../actions';
import {
    createList,
} from '../utils/store';



export default function subOrgs(state = null, action) {
    switch (action.type) {
        case types.RETREIVE_SUB_ORGS + '_PENDING':
            return Object.assign({}, state, 
                createList(null, { isPending: true }));
        case types.RETREIVE_SUB_ORGS + '_REJECTED':
            return Object.assign({}, state, 
                createList(null, { error: action.payload.data }));
        case types.RETRIEVE_SUB_ORGS + '_FULFILLED':
            return Object.assign({}, state, 
                createList(action.payload.data.data, { isPending: false }));
        default:
            return state || Object.assign({}, state, createList());
    }
}

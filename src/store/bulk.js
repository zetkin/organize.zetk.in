import * as types from '../actions';

export default function bulk(state = null, action) {
    switch (action.type) {
        case types.EXECUTE_BULK_OPERATION + '_PENDING':
            return Object.assign({}, state, {
                bulkOpIsPending: true,
            });

        case types.EXECUTE_BULK_OPERATION + '_FULFILLED':
            return Object.assign({}, state, {
                bulkOpIsPending: false,
            });

        default:
            return state || {
               bulkOpIsPending: false,
            };
    }
}

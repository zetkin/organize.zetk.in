import * as types from '../actions';
import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';


export default function queries(state = null, action) {
    // TODO: Implement full API communications
    switch (action.type) {
        case types.RETRIEVE_QUERY_MATCHES + '_FULFILLED':
            let query = {
                id: action.meta.id,
                matchList: createList(action.payload.data.data)
            };

            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query)
            });

        case types.RETRIEVE_CALL_ASSIGNMENTS + '_FULFILLED':
            let assignments = action.payload.data.data;
            let queries = assignments.map(a => a.target);

            return Object.assign({}, state, {
                queryList: updateOrAddListItems(state.queryList,
                    queries, { isPending: false, error: null }),
            });

        default:
            return state || {
                queryList: createList()
            };
    }
}

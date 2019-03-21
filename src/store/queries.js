import * as types from '../actions';
import {
    createList,
    updateOrAddListItem,
    updateOrAddListItems,
    removeListItem
} from '../utils/store';


export default function queries(state = null, action) {
    let query;
    switch (action.type) {
        case types.RETRIEVE_QUERIES + '_PENDING':
            return Object.assign({}, state, {
                queryList: Object.assign({}, state.queryList, {
                    isPending: true,
                }),
            });

        case types.RETRIEVE_QUERIES + '_FULFILLED':
            return Object.assign({}, state, {
                queryList: updateOrAddListItems(state.queryList,
                    action.payload.data.data,
                    { isPending: false, error: null })
            });

        case types.RETRIEVE_QUERY + '_PENDING':
            query = { id: action.meta.id };
            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query, { isPending: true }),
            });

        case types.RETRIEVE_QUERY + '_FULFILLED':
            query = action.payload.data.data;

            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query, { isPending: false, error: null }),
            });

        case types.CREATE_QUERY + '_FULFILLED':
        case types.UPDATE_QUERY + '_FULFILLED':
            query = action.payload.data.data;

            // Clear match list since the query changed
            query.matchList = null;

            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query, { isPending: false, error: null }),
            });

        case types.RETRIEVE_QUERY_MATCHES + '_PENDING':
            query = {
                id: action.meta.id,
                matchList: createList(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query)
            });

        case types.RETRIEVE_QUERY_MATCHES + '_FULFILLED':
            query = {
                id: action.meta.id,
                matchList: createList(action.payload.data.data)
            };

            return Object.assign({}, state, {
                queryList: updateOrAddListItem(state.queryList,
                    query.id, query)
            });

        case types.REMOVE_QUERY + '_FULFILLED':
            return {
                ...state,
                queryList: removeListItem(state.queryList, action.meta.id)
            };

        case types.RETRIEVE_CALL_ASSIGNMENTS + '_FULFILLED':
            let assignments = action.payload.data.data;
            let queries = assignments.map(a => a.target)
                .concat(assignments.map(a => a.goal));

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

import Z from 'zetkin';

import * as types from '.';


// TODO: Implement API calls for all of these

export function retrieveQueries() {
    return {
        type: types.RETRIEVE_QUERIES,
    };
}

export function retrieveQueryMatches(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_QUERY_MATCHES,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', 'queries', id, 'matches').get(),
            }
        });
    };
}

export function createQuery(title) {
    return {
        type: types.CREATE_QUERY,
    };
}

export function addQueryFilter(queryId, filterType) {
    return {
        type: types.ADD_QUERY_FILTER,
        payload: { filterType },
    };
}

export function updateQueryFilter(queryId, filterIndex, filterConfig) {
    return {
        type: types.UPDATE_QUERY_FILTER,
        payload: { queryId, filterIndex, filterConfig },
    };
}

export function removeQueryFilter(queryId, filterIndex) {
    return {
        type: types.REMOVE_QUERY_FILTER,
        payload: { queryId, filterIndex }
    };
}

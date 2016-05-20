import Z from 'zetkin';

import * as types from '.';


export function retrieveQueries() {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_QUERIES,
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'queries').get(),
            }
        });
    }
}

export function retrieveQuery(id) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_QUERY,
            meta: { id },
            payload: {
                promise: Z.resource('orgs', orgId, 'people', 'queries',
                    id).get()
            },
        });
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
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        let data = {
            title: title,
            filter_spec: [],
        };

        dispatch({
            type: types.CREATE_QUERY,
            meta: { title },
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', 'queries').post(data),
            },
        });
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

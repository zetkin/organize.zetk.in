import Z from 'zetkin';

import * as types from '.';
import { getListItemById } from '../utils/store';


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

export function addQueryFilter(id, filterType) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        let queryList = getState().queries.queryList;
        let queryItem = getListItemById(queryList, id);

        let data = {
            filter_spec: queryItem.data.filter_spec.concat([{
                type: filterType,
            }])
        };

        dispatch({
            type: types.ADD_QUERY_FILTER,
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data)
            },
        });
    }
}

export function updateQueryFilter(id, filterIndex, filterConfig) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        let queryList = getState().queries.queryList;
        let queryItem = getListItemById(queryList, id);
        let filterSpec = queryItem.data.filter_spec.concat();

        filterSpec[filterIndex] = Object.assign({},
            filterSpec[filterIndex], filterConfig);

        let data = {
            filter_spec: filterSpec,
        };

        dispatch({
            type: types.UPDATE_QUERY_FILTER,
            payload: {
                promise: Z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data)
            },
        });
    }
}

export function removeQueryFilter(queryId, filterIndex) {
    return {
        type: types.REMOVE_QUERY_FILTER,
        payload: { queryId, filterIndex }
    };
}

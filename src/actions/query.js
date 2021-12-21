import * as types from '.';
import { getListItemById } from '../utils/store';


function mapOrganizationParams(data) {
    data.filter_spec = data.filter_spec.map(spec => {
        if(spec.config.organizationOption) {
            if(spec.config.organizationOption != 'specific') {
                spec.config.organizations = spec.config.organizationOption;
            } else {
                spec.config.organizations = spec.config.specificOrganizations;
            }

            delete spec.config.organizationOption;
            delete spec.config.specificOrganizations;
        }

        return spec;
    });

    return data;
}

export function retrieveQueries() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_QUERIES,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'queries').get(),
            },
            meta: {
                recursive: true,
            }
        });
    }
}

export function retrieveQueriesRecursive() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_QUERIES,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'queries?recursive').get(),
            },
            meta: {
                recursive: true,
            }
        });
    }
}

export function retrieveQuery(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_QUERY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'queries',
                    id).get()
            },
        });
    };
}

export function retrieveQueryMatches(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_QUERY_MATCHES,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries', id, 'matches').get(),
            }
        });
    };
}

export function createQuery(data, paneId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_QUERY,
            meta: { paneId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries').post(data),
            },
        });
    };
}

export function updateQuery(id, data) {
    data = mapOrganizationParams(data);

    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_QUERY,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data),
            },
        });
    };
}

export function removeQuery(id) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_QUERY,
            meta: { id },
            payload: {
                promise: z.resource(`orgs/${orgId}/people/queries/${id}`).del()
            }
        })
    };
}

export function addQueryFilter(id, filterType) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let queryList = getState().queries.queryList;
        let queryItem = getListItemById(queryList, id);

        let data = {
            filter_spec: queryItem.data.filter_spec.concat([{
                op: 'add',
                config: {},
                type: filterType,
            }])
        };

        dispatch({
            type: types.ADD_QUERY_FILTER,
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data)
            },
        });
    }
}

export function updateQueryFilter(id, filterIndex, filterConfig) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let queryList = getState().queries.queryList;
        let queryItem = getListItemById(queryList, id);
        let filterSpec = queryItem.data.filter_spec.concat();

        filterSpec[filterIndex] = Object.assign({}, filterSpec[filterIndex], {
            config: filterConfig
        });

        let data = {
            filter_spec: filterSpec,
        };

        data = mapOrganizationParams(data);

        dispatch({
            type: types.UPDATE_QUERY_FILTER,
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data)
            },
        });
    }
}

export function removeQueryFilter(id, filterIndex) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let queryList = getState().queries.queryList;
        let queryItem = getListItemById(queryList, id);
        let filterSpec = queryItem.data.filter_spec.concat();

        filterSpec.splice(filterIndex, 1);

        let data = {
            filter_spec: filterSpec,
        };

        dispatch({
            type: types.REMOVE_QUERY_FILTER,
            payload: {
                promise: z.resource('orgs', orgId,
                    'people', 'queries', id).patch(data)
            },
        });
    }
}

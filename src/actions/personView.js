import * as types from '.';


export function addPersonViewRow(viewId, personId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.ADD_PERSON_VIEW_ROW,
            meta: { viewId, personId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'rows', personId).put(),
            }
        });
    };
}

export function createPersonView(data, defaultColumns=[]) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        let viewRes = null;

        dispatch({
            type: types.CREATE_PERSON_VIEW,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views')
                    .post(data)
                    .then(res => {
                        viewRes = res;

                        // Add default columns
                        if (defaultColumns && defaultColumns.length) {
                            let promise = Promise.resolve();

                            // Create columns sequentially to guarantee order
                            defaultColumns.forEach(colData => {
                                promise = promise.then(() =>
                                    z.resource('orgs', orgId, 'people', 'views', viewRes.data.data.id, 'columns').post(colData));
                            });

                            return promise
                                .catch(err => {
                                    // Ignore errors for default columns
                                });
                        }
                    })
                    .then(() => viewRes),
            }
        });
    };
}

export function createPersonViewColumn(viewId, data) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_PERSON_VIEW_COLUMN,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'columns').post(data),
            }
        });
    };
}

export function removePersonViewRow(viewId, personId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_PERSON_VIEW_ROW,
            meta: { viewId, personId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'rows', personId).del(),
            }
        });
    };
}

export function retrievePersonViews() {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEWS,
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views').get(),
            }
        });
    };
}

export function retrievePersonView(viewId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEW,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId).get(),
            }
        });
    };
}

export function retrievePersonViewColumns(viewId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEW_COLUMNS,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'columns').get(),
            }
        });
    };
}

export function retrievePersonViewRows(viewId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEW_ROWS,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'rows').get(),
            }
        });
    };
}

export function retrievePersonViewRow(viewId, personId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEW_ROW,
            meta: { viewId, personId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'rows', personId).get(),
            }
        });
    };
}

export function retrievePersonViewQuery(viewId, queryId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_PERSON_VIEW_QUERY,
            meta: { viewId, queryId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'queries', queryId, 'matches?view_id=' + viewId).get(),
            }
        });
    };
}

export function updatePersonView(viewId, data) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_PERSON_VIEW,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId).patch(data),
            }
        });
    };
}

export function updatePersonViewColumn(viewId, columnId, data) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.UPDATE_PERSON_VIEW_COLUMN,
            meta: { viewId, columnId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'columns', columnId).patch(data),
            }
        });
    };
}

export function removePersonViewColumn(viewId, columnId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_PERSON_VIEW_COLUMN,
            meta: { viewId, columnId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'columns', columnId).del(),
            }
        });
    };
}

import { csvFormatRows } from 'd3-dsv';

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

export function deletePersonView(viewId) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_PERSON_VIEW,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId).del(),
            }
        });
    };
}



export function createPersonViewColumn(viewId, data) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        if(data.title.length > 80) {
            data.title = data.title.substring(0,77) + '...';
        }

        dispatch({
            type: types.CREATE_PERSON_VIEW_COLUMN,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'columns').post(data),
            }
        });
    };
}

export function exportPersonView(viewId, queryId) {
    return ({ getState }) => {
        const personViews = getState().personViews;
        const columnList = personViews.columnsByView[viewId];
        let rowList = personViews.rowsByView[viewId];

        if (queryId) {
            rowList = personViews.matchesByViewAndQuery[viewId][queryId];
        }

        const rows = [];

        if (columnList && columnList.items && rowList && rowList.items) {
            // Start with the header
            rows.push(['Zetkin ID'].concat(columnList.items.map(colItem => colItem.data.title)));

            // Add all rows
            rowList.items.forEach(rowItem => {
                const data = rowItem.data;
                rows.push([data.id].concat(data.content));
            });
        }

        // Download CSV
        const csvStr = csvFormatRows(rows);
        const blob = new Blob([ csvStr ], { type: 'text/csv' });
        const now = new Date();
        const dateStr = now.format('%Y%m%d');
        const timeStr = now.format('%H%m%S');
        const a = document.createElement('a');
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', `${dateStr}_${timeStr}.csv`);
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
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

export function reorderViewColumns(viewId, order) {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;
        const data = {
            order: order.map(id => parseInt(id)),
        };

        dispatch({
            type: types.REORDER_PERSON_VIEW_COLUMNS,
            meta: { viewId },
            payload: {
                promise: z.resource('orgs', orgId, 'people', 'views', viewId, 'column_order').patch(data),
            }
        });
    };
}

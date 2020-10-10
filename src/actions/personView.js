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

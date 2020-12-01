import * as types from '.';


export function retrieveSubOrgsRecursive() {
    return ({ dispatch, getState, z }) => {
        const orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_SUB_ORGS,
            payload: {
                promise: z.resource('orgs', orgId, 'sub_organizations?recursive').get(),
            },
        });
    };
}


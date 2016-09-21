import * as types from '.';


export function retrieveOfficials() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_OFFICIALS,
            payload: {
                promise: z.resource('orgs', orgId, 'officials').get()
            }
        })
    };
}

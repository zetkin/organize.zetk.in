import * as types from '.';


export function retrieveCalls() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALLS,
            payload: {
                promise: z.resource('orgs', orgId, 'calls').get(),
            }
        });
    };
}

export function retrieveCall(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALL,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'calls', id).get()
            }
        });
    };
}

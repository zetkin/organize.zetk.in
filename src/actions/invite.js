import * as types from '.';


export function retrieveInvites() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_INVITES,
            payload: {
                promise: z.resource('orgs', orgId, 'invites').get()
            }
        });
    };
}

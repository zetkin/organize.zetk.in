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

export function createInvite(email) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.CREATE_INVITE,
            meta: { email },
            payload: {
                promise: z.resource('orgs', orgId, 'invites').post({ email })
            }
        });
    };
}

export function deleteInvite(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.DELETE_INVITE,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'invites', id).del()
            },
        });
    };
}

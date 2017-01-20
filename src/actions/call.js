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

export function toggleCallActionTaken(id, actionTaken) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = { organizer_action_taken: !!actionTaken };

        dispatch({
            type: types.TOGGLE_CALL_ACTION_TAKEN,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'calls', id).patch(data),
            }
        });
    }
}

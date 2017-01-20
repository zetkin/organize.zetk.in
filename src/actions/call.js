import * as types from '.';


export function retrieveCalls(page = 0, perPage = 100) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.RETRIEVE_CALLS,
            meta: { page },
            payload: {
                promise: z.resource('orgs', orgId, 'calls')
                    .get(page, perPage),
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
